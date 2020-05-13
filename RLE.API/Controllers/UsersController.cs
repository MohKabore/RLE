using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using RLE.API.Data;
using RLE.API.Dtos;
using RLE.API.Helpers;
using RLE.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;
using System.Text.Encodings.Web;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using CloudinaryDotNet;
using Account = CloudinaryDotNet.Account;


namespace RLE.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IRleRepository _repo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        string password;

        private readonly UserManager<User> _userManager;
        int operatorTypeId;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public UsersController(IConfiguration config, DataContext context, IRleRepository repo,
        UserManager<User> userManager, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _userManager = userManager;
            _config = config;
            _context = context;
            _repo = repo;
            _mapper = mapper;
            password = _config.GetValue<String>("AppSettings:defaultPassword");
            operatorTypeId = _config.GetValue<int>("AppSettings:OperatorTypeId");

            _cloudinaryConfig = cloudinaryConfig;
            Account acc = new Account(
               _cloudinaryConfig.Value.CloudName,
               _cloudinaryConfig.Value.ApiKey,
               _cloudinaryConfig.Value.ApiSecret
           );

            _cloudinary = new Cloudinary(acc);
        }
        [HttpPost("SearchNewEmps")]
        public async Task<IActionResult> SearchNewEmps(EmpSearchModelDto searchModel)
        {
            var users = new List<User>();
            string req = "select * from AspnetUsers where LastName + ' ' + firstName Like '%" + searchModel.EmpName + "%'" +
            " and Active=0  and TypeEmpId=" + Convert.ToInt32(searchModel.TypeEmpId);
            if (searchModel.RegionId != null)
                req += "and RegionId =" + Convert.ToInt32(searchModel.RegionId);
            if (searchModel.DepartmentId != null)
                req += "and DepartmentId =" + Convert.ToInt32(searchModel.DepartmentId);
            if (searchModel.ResCityId != null)
                req += "and ResCityId =" + Convert.ToInt32(searchModel.ResCityId);

            users = await _context.Users.Include(a => a.TypeEmp)
                                        .Include(a => a.Photos)
                                        .Include(a => a.Region)
                                        .Include(a => a.Department)
                                        .Include(a => a.ResCity)
                                        .Include(a => a.StudyLevel)
                                        .Include(a => a.EducationalTrack)
                                        .FromSql(req)
                                        .OrderBy(a => a.LastName)
                                        .ThenBy(a => a.FirstName)
                                        .ToListAsync();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpPost("SearchPreSelectedEmps")]
        public async Task<IActionResult> SearchPreSelectedEmps(EmpSearchModelDto searchModel)
        {
            var users = new List<User>();
            string req = "select * from AspnetUsers where PreSelected=1 and Ontraining=0" +
            " and Active=0 and TypeEmpId=" + Convert.ToInt32(searchModel.TypeEmpId);
            if (searchModel.RegionId != null)
                req += "and RegionId =" + Convert.ToInt32(searchModel.RegionId);
            if (searchModel.DepartmentId != null)
                req += "and DepartmentId =" + Convert.ToInt32(searchModel.DepartmentId);
            if (searchModel.ResCityId != null)
                req += "and ResCityId =" + Convert.ToInt32(searchModel.ResCityId);

            users = await _context.Users.Include(a => a.TypeEmp)
                                        .Include(a => a.Photos)
                                        .Include(a => a.Region)
                                        .Include(a => a.Department)
                                        .Include(a => a.ResCity)
                                        .Include(a => a.StudyLevel)
                                        .Include(a => a.EducationalTrack)
                                        .FromSql(req)
                                        .OrderBy(a => a.LastName)
                                        .ThenBy(a => a.FirstName)
                                        .ToListAsync();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }



        [HttpPost("SaveUserAssignAccount/{insertUserId}")]
        public async Task<IActionResult> SaveUserAssignAccount(List<UserIdDto> userIds, int insertUserId)
        {
            foreach (var userid in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userid.UserId);
                if (user != null)
                {

                    // envoi du lien
                    var callbackUrl = _config.GetValue<String>("AppSettings:DefaultEmailValidationLink") + user.ValidationCode;
                    var emailForm = new EmailFormDto
                    {
                        toEmail = user.Email,
                        subject = "Création de compte RLE ALbatros Technologies",
                        content = $"veuillez creer votre compte au lien suivant : <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicker ici</a>.",
                    };
                    var res = await _repo.SendEmail(emailForm);
                    if (res == true)
                    {
                        var uh = new UserHistory
                        {
                            InsertUserId = insertUserId,
                            UserId = user.Id,
                            UserHistoryTypeId = _config.GetValue<int>("AppSettings:SendLinkHistorytypeId")
                        };
                        _repo.Add(uh);
                        await _repo.SaveAll();
                    }
                }
            }
            return Ok();
        }

        [HttpPost("SavePreSelection/{insertUserId}")]
        public async Task<IActionResult> SavePreSelection(List<UserIdDto> userIds, int insertUserId)
        {
            foreach (var userid in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userid.UserId);
                if (user != null)
                {
                    user.PreSelected = true;
                    user.Nok = 0;
                    _repo.Update(user);
                }

                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = user.Id,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:PreSelectionHistorytypeId")
                };
                _repo.Add(uh);


            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

    
        [HttpPost("SaveReachable")]
        public async Task<IActionResult> SaveReachable(List<UserIdDto> userIds)
        {
            foreach (var userid in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userid.UserId);
                if (user != null)
                {
                    user.PreSelected = true;
                    user.Nok = 0;
                    _repo.Update(user);
                }

            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

         [HttpPost("SaveUnReachable")]
        public async Task<IActionResult> SaveUnReachable(List<UserIdDto> userIds)
        {
            foreach (var userid in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userid.UserId);
                if (user != null)
                {
                    user.PreSelected = true;
                    user.Nok = 1;
                    _repo.Update(user);
                }

            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

          [HttpPost("SaveDisclaimer")]
        public async Task<IActionResult> SaveDisclaimer(List<UserIdDto> userIds)
        {
            foreach (var userid in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userid.UserId);
                if (user != null)
                {
                    user.PreSelected = true;
                    user.Nok = 2;
                    _repo.Update(user);
                }

            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPost("AddTraining/{insertUserId}")]
        public async Task<IActionResult> AddTraining(TrainingCreationDto formationDto, int insertUserId)
        {
            var TrainingToCreate = _mapper.Map<Training>(formationDto);
            _repo.Add(TrainingToCreate);
            if (await _repo.SaveAll())
            {
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    TrainingId = TrainingToCreate.Id,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:CreateTrainingHistorytypeId")
                };
                _repo.Add(uh);
                await _repo.SaveAll();
                return Ok(TrainingToCreate.Id);
            }
            return BadRequest();

        }


        [HttpPost("AddtrainingClass/{insertUserId}")]
        public async Task<IActionResult> AddtrainingClass(TrainingClassCreationDto trClass, int insertUserId)
        {
            var classToCreate = _mapper.Map<TrainingClass>(trClass);
            _repo.Add(classToCreate);

            foreach (var trainerId in trClass.TrainerIds)
            {
                var trainerClass = new TrainerClass
                {
                    TrainerId = trainerId,
                    TrainingClassId = classToCreate.Id
                };
                _repo.Add(trainerClass);
            }
            if (await _repo.SaveAll())
            {
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    TrainingClassId = classToCreate.Id,
                    TrainingId = classToCreate.TrainingId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:CreateTrainingClassHistorytypeId")
                };
                _repo.Add(uh);
                await _repo.SaveAll();


                //retour d'un trainingClassDto
                CultureInfo frC = new CultureInfo("fr-FR");
                var newClass = await _context.TrainingClasses.Include(a => a.Region)
                                                                .Include(a => a.Department)
                                                                .Include(a => a.City)
                                                                .FirstOrDefaultAsync(a => a.Id == classToCreate.Id);
                var trainers = await _context.Users.Where(u => trClass.TrainerIds.Contains(u.Id)).ToListAsync();

                //        Trainers = _mapper.Map<List<UserForListDto>>(trainers),                        
                var classToReturn = new TrainingClassDetailDto()
                {
                    Id = classToCreate.Id,
                    Name = classToCreate.Name,
                    TotalParticipants = 0,
                    RegionName = classToCreate.Region.Name,
                    DepartmentName = classToCreate.Department?.Name,
                    CityName = classToCreate.City?.Name,
                    CityId = classToCreate.CityId,
                    DepartmentId = classToCreate.DepartmentId,

                    RegionId = classToCreate.RegionId,
                    StartDate = classToCreate.StartDate.ToString("dd/MM/yyyy", frC),
                    EndDate = classToCreate.EndDate.ToString("dd/MM/yyyy", frC),
                    Trainers = _mapper.Map<List<UserForListDto>>(trainers)
                };
                return Ok(classToReturn);
            }
            return BadRequest();

        }

        [HttpPut("EditTraining/{trainingId}/{insertUserId}")]
        public async Task<IActionResult> EditTraining(TrainingForUpdateDto trainingDto, int trainingId, int insertUserId)
        {

            var training = await _context.Trainings.FirstOrDefaultAsync(a => a.Id == trainingId);
            if (training != null)
            {
                _mapper.Map(trainingDto, training);

                if (await _repo.SaveAll())
                {
                    var uh = new UserHistory
                    {
                        InsertUserId = insertUserId,
                        TrainingId = training.Id,
                        UserHistoryTypeId = _config.GetValue<int>("AppSettings:EditTrainingHistorytypeId")
                    };
                    _repo.Add(uh);
                    await _repo.SaveAll();
                    return Ok();
                }
                return BadRequest();
            }
            return NotFound();
        }

        [HttpPost("DeleteTraining/{trainingId}/{insertUserId}")]
        public async Task<IActionResult> DeleteTraining(int trainingId, int insertUserId)
        {
            var training = await _context.Trainings.Include(a => a.TrainingClasses)
                                                    .FirstOrDefaultAsync(a => a.Id == trainingId);
            if (training != null)
            {
                if (training.TrainingClasses.Count() == 0)
                {
                    training.Active = 0;

                    if (await _repo.SaveAll())
                    {
                        var uh = new UserHistory
                        {
                            InsertUserId = insertUserId,
                            TrainingId = training.Id,
                            UserHistoryTypeId = _config.GetValue<int>("AppSettings:DeleteTrainingHistorytypeId")
                        };
                        _repo.Add(uh);
                        await _repo.SaveAll();
                        return Ok();
                    }
                }
                return BadRequest("cette formation a deja des classes assignées");

            }
            return NotFound();
        }


        [HttpGet("{regionId}/GetSelectedMaintsByRegionId")]
        public async Task<IActionResult> GetCities(int regionId)
        {
            var maints = await _context.Users
                                    .Where(a => a.RegionId == regionId && a.Selected == true
                                    && a.TypeEmpId == _config.GetValue<int>("AppSettings:maintenancierTypeId"))
                                    .OrderBy(a => a.LastName)
                                    .ThenBy(a => a.FirstName)
                                    .ToListAsync();
            return Ok(maints);
        }

        [HttpGet("{regionId}/RegionTrainings")]
        public async Task<IActionResult> RegionTrainings(int regionId)
        {
            var trainings = await _context.Trainings.Where(a => a.RegionId == regionId && a.Active == 1)
                                                    .Include(a => a.TrainingClasses)
                                                    .ToListAsync();
            return Ok(trainings);
        }


        [HttpGet("{regionId}/GetTrainingClassesByRegionId")]
        public async Task<IActionResult> GetTrainingClassesByRegionId(int regionId)
        {
            var trainingstoReturn = new List<TrainingDetailDto>();
            var trainings = await _context.Trainings.Where(a => a.RegionId == regionId && a.Active == 1)
                                                    .Include(a => a.TrainingClasses)
                                                    .ToListAsync();
            foreach (var tr in trainings)
            {
                var t = new TrainingDetailDto()
                {
                    Name = tr.Name,
                    Description = tr.Description,
                    Id = tr.Id,
                    RegionId = Convert.ToInt32(tr.RegionId),
                    TotalClasses = tr.TrainingClasses.Where(a => a.Active == true).Count()
                };
                var classIds = tr.TrainingClasses.Where(a => a.Active == true).Select(a => a.Id);
                var trIds = await _context.TrainerClasses.Where(a => classIds.Contains(a.TrainingClassId))
                                                .Select(a => a.TrainerId)
                                                .Distinct()
                                                .ToListAsync();

                var trUsers = await _context.EmployeeClasses.Where(a => classIds.Contains(a.TrainingClassId))
                                                .Select(a => a.EmployeeId)
                                                .Distinct()
                                                .ToListAsync();
                t.TotalTrainers = trIds.Count();
                t.TotalParticipants = trUsers.Count();

                trainingstoReturn.Add(t);

            }

            return Ok(trainingstoReturn);
        }

        [HttpGet("{trainingId}/ClosedTrainingClasses")]
        public async Task<IActionResult> ClosedTrainingClasses(int trainingId)
        {
            var trClass = await _context.TrainingClasses.Where(a => a.TrainingId == trainingId && a.Active == true && a.Status == 1)
                                                                .Include(a => a.Region)
                                                                .Include(a => a.Department)
                                                                .Include(a => a.City)
                                                                .ToListAsync();
            if (trClass.Count() > 0)
            {
                var trainingClasses = new List<TrainingClassDetailDto>();
                CultureInfo frC = new CultureInfo("fr-FR");
                foreach (var trC in trClass)
                {
                    // liste des formateurs
                    var trDetail = new TrainingClassDetailDto
                    {
                        Id = trC.Id,
                        Name = trC.Name,
                        TrainingId = trC.TrainingId,
                        RegionName = trC.Region.Name,
                        DepartmentName = trC.Department?.Name,
                        CityName = trC.City?.Name,
                        CityId = trC.CityId,
                        Active = trC.Active,
                        Status = trC.Status,
                        DepartmentId = trC.DepartmentId,
                        RegionId = trC.RegionId,
                        StartDate = trC.StartDate.ToString("dd/MM/yyyy", frC),
                        EndDate = trC.EndDate.ToString("dd/MM/yyyy", frC),
                        // Participants = new List<UserForListDto>()
                        // Trainers = _mapper.Map<List<UserForListDto>>(trainers),
                        // TotalTrainers = trainers.Count()
                    };
                    trainingClasses.Add(trDetail);
                }
                return Ok(trainingClasses);
            }
            return NotFound();

        }
        [HttpGet("{trainingId}/GetTrainingDetails")]
        public async Task<IActionResult> GetTrainingDetails(int trainingId)
        {
            var training = await _context.Trainings.Include(a => a.Region).FirstOrDefaultAsync(a => a.Id == trainingId);
            if (training != null)
            {
                CultureInfo frC = new CultureInfo("fr-FR");
                var trainingToReturn = new TrainingDetailDto
                {
                    Name = training.Name,
                    Id = training.Id,
                    RegionId = Convert.ToInt32(training.RegionId),
                    Description = training.Description,
                    RegionName = training.Region.Name,
                    TrainingClasses = new List<TrainingClassDetailDto>()
                };
                var trainingClasses = await _context.TrainingClasses.Where(a => a.TrainingId == trainingId && a.Active == true)
                                                                .Include(a => a.Region)
                                                                .Include(a => a.Department)
                                                                .Include(a => a.City)
                                                                .ToListAsync();
                var trainingClassIds = trainingClasses.Select(a => a.Id);

                foreach (var trClass in trainingClasses)
                {
                    // liste des formateurs
                    var trainers = _context.TrainerClasses.Where(a => a.TrainingClassId == trClass.Id)
                                            .Select(a => a.Trainer).ToList();

                    //liste des participants
                    var totalParticipants = _context.EmployeeClasses.Where(a => a.TrainingClassId == trClass.Id).ToList().Count();
                    var trDetail = new TrainingClassDetailDto
                    {
                        Id = trClass.Id,
                        Name = trClass.Name,
                        TrainingId = trClass.TrainingId,
                        TotalParticipants = totalParticipants,
                        RegionName = trClass.Region.Name,
                        DepartmentName = trClass.Department?.Name,
                        CityName = trClass.City?.Name,
                        CityId = trClass.CityId,
                        Active = trClass.Active,
                        Status = trClass.Status,
                        DepartmentId = trClass.DepartmentId,
                        RegionId = trClass.RegionId,
                        TrainerIds = trainers.Select(a => a.Id).ToList(),
                        StartDate = trClass.StartDate.ToString("dd/MM/yyyy", frC),
                        EndDate = trClass.EndDate.ToString("dd/MM/yyyy", frC),
                        // Participants = new List<UserForListDto>(),
                        Trainers = _mapper.Map<List<UserForListDto>>(trainers),
                        TotalTrainers = trainers.Count()
                    };
                    trainingToReturn.TotalClasses = +1;
                    trainingToReturn.TrainingClasses.Add(trDetail);
                }
                var tt = trainingToReturn.TrainingClasses.Select(t => t.TrainerIds).Distinct();
                trainingToReturn.TotalTrainers = tt.ToList().Distinct().Count();
                trainingToReturn.TotalParticipants = trainingToReturn.TrainingClasses.Sum(a => a.TotalParticipants);
                return Ok(trainingToReturn);
            }


            return NotFound();



        }

        [HttpPut("EditTrainingClass/{trainingClassId}/{insertUserId}")]
        public async Task<IActionResult> EditTrainingClass(TrainingClassCreationDto trainingClassDto, int trainingClassId, int insertUserId)
        {

            var trainingClass = await _context.TrainingClasses.FirstOrDefaultAsync(a => a.Id == trainingClassId);
            if (trainingClass != null)
            {
                _mapper.Map(trainingClassDto, trainingClass);

                if (await _repo.SaveAll())
                {
                    var uh = new UserHistory
                    {
                        InsertUserId = insertUserId,
                        TrainingId = trainingClass.TrainingId,
                        TrainingClassId = trainingClass.Id,
                        UserHistoryTypeId = _config.GetValue<int>("AppSettings:EditTrainingClassHistorytypeId")
                    };
                    _repo.Add(uh);
                    await _repo.SaveAll();

                    CultureInfo frC = new CultureInfo("fr-FR");
                    var newClass = await _context.TrainingClasses.Include(a => a.Region)
                                                                    .Include(a => a.Department)
                                                                    .Include(a => a.City)
                                                                    .FirstOrDefaultAsync(a => a.Id == trainingClass.Id);
                    var trainers = await _context.Users.Where(u => trainingClassDto.TrainerIds.Contains(u.Id)).ToListAsync();

                    var totalParticipants = _context.EmployeeClasses.Where(a => a.TrainingClassId == trainingClass.Id).ToList().Count();

                    //        Trainers = _mapper.Map<List<UserForListDto>>(trainers),                        
                    var classToReturn = new TrainingClassDetailDto()
                    {
                        Id = trainingClass.Id,
                        Name = trainingClass.Name,
                        TotalParticipants = totalParticipants,
                        TotalTrainers = trainers.Count(),
                        RegionName = trainingClass.Region.Name,
                        DepartmentName = trainingClass.Department?.Name,
                        CityName = trainingClass.City?.Name,
                        CityId = trainingClass.CityId,
                        TrainingId = trainingClass.TrainingId,
                        DepartmentId = trainingClass.DepartmentId,
                        RegionId = trainingClass.RegionId,
                        StartDate = trainingClass.StartDate.ToString("dd/MM/yyyy", frC),
                        EndDate = trainingClass.EndDate.ToString("dd/MM/yyyy", frC),
                        Trainers = _mapper.Map<List<UserForListDto>>(trainers)
                    };
                    return Ok(classToReturn);
                }
                return BadRequest();
            }
            return NotFound();
        }

        //     [HttpGet("AllRegionOpDetails")]
        // public async Task<IActionResult> AllRegionOpDetails()
        // {
        //     var quotas = await _context.Quotas.ToListAsync();
        //     var inscrpitionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:InscriptionQuota")).Percentage;
        //     var preselectionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:PreselectionQuota")).Percentage;
        //     var onTrainingQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:FormationQuota")).Percentage;
        //     var selectionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:SelectionQuota")).Percentage;
        //     var allDepartments = await _context.Departments.ToArrayAsync();
        //     var allCities = await _context.Cities.ToArrayAsync();
        //     int operatorTypeId = _config.GetValue<int>("AppSettings:OperatorTypeId");
        //     var allOperators = await _context.Users.Where(u => u.TypeEmpId == operatorTypeId).ToListAsync();


        //     var allRegions = await _context.Regions.OrderBy(a => a.Name).ToListAsync();
        //     var regionsToReturn = new List<RegionForDetailDto>();
        //     foreach (var region in allRegions)
        //     {
        //         var r = new RegionForDetailDto
        //         {
        //             Id = region.Id,
        //             Name = region.Name,
        //             Code = region.Code,
        //             Departments = new List<DepartmentForDetailDto>()

        //         };
        //         var departments = allDepartments.Where(d => d.RegionId == region.Id).OrderBy(d => d.Name).ToList();
        //         foreach (var dept in departments)
        //         {
        //             var d = new DepartmentForDetailDto()
        //             {
        //                 Id = dept.Id,
        //                 Name = dept.Name,
        //                 Code = dept.Code

        //             };

        //             var cities = allCities.Where(re => re.DepartmentId == dept.Id)
        //                                                     .OrderBy(a => a.Name);
        //             foreach (var city in cities)
        //             {
        //                 var operators = allOperators.Where(u => u.ResCityId == city.Id);
        //                 var c = new CityForDetailDto
        //                 {
        //                     Id = city.Id,
        //                     Name = city.Name,
        //                     Code = city.Code,
        //                     TotalRegistered = operators.Count(),
        //                     TotalPreSelected = operators.Where(a => a.PreSelected == true).Count(),
        //                     TotalOnTraining = operators.Where(a => a.OnTraining == true).Count(),
        //                     TotalSelected = operators.Where(a => a.Selected == true).Count(),
        //                     NbEmpNeeded = city.NbEmpNeeded,
        //                 };
        //                 c.TotalRegisteredPrct = (int)Math.Round(100 * ((r.NbEmpNeeded * inscrpitionQuota)), 2);
        //                 d.TotalSelected += c.TotalSelected;
        //                 d.TotalOnTraining += c.TotalOnTraining;
        //                 d.TotalPreSelected += c.TotalPreSelected;
        //                 d.TotalRegistered += c.TotalRegistered;
        //                 d.NbEmpNeeded += c.NbEmpNeeded;
        //             }
        //             r.TotalOnTraining += d.TotalOnTraining;
        //             r.TotalPreSelected += d.TotalPreSelected;
        //             r.TotalRegistered += d.TotalRegistered;
        //             r.TotalSelected += d.TotalSelected;
        //             r.NbEmpNeeded += d.NbEmpNeeded;
        //             r.PrctRegistered = Math.Round(100 * ((double)r.TotalRegistered / (double)(r.NbEmpNeeded * inscrpitionQuota)), 2);
        //             r.PrctPreselected = Math.Round(100 * ((double)r.TotalPreSelected / (double)(r.NbEmpNeeded * preselectionQuota)), 2);
        //             r.PrctOnTraining = Math.Round(100 * ((double)r.TotalOnTraining / (double)(r.NbEmpNeeded * onTrainingQuota)), 2);
        //             r.PrctSelected = Math.Round(100 * ((double)r.TotalSelected / (double)(r.NbEmpNeeded * selectionQuota)), 2);
        //             r.TotalRegisteredPrct = Convert.ToInt32(r.NbEmpNeeded * inscrpitionQuota);
        //             r.TotalReserveToHave = Convert.ToInt32((r.NbEmpNeeded * inscrpitionQuota) - r.NbEmpNeeded);
        //         }
        //         regionsToReturn.Add(r);
        //     }
        //     return Ok(regionsToReturn);
        // }

        [HttpGet("AllRegionOpDetails")]
        public async Task<IActionResult> AllRegionOpDetails()
        {
            var quotas = await _context.Quotas.ToListAsync();
            var inscrpitionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:InscriptionQuota")).Percentage;
            var preselectionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:PreselectionQuota")).Percentage;
            var onTrainingQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:FormationQuota")).Percentage;
            var selectionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:SelectionQuota")).Percentage;
            var allDepartments = await _context.Departments.ToArrayAsync();
            var allCities = await _context.Cities.ToArrayAsync();
            int operatorTypeId = _config.GetValue<int>("AppSettings:OperatorTypeId");
            var allOperators = await _context.Users.Where(u => u.TypeEmpId == operatorTypeId && u.PreSelected==true && u.Nok==0).ToListAsync();

            var recap = new CitiesRecap();
            recap.TotalCities = allCities.Count();

            var allRegions = await _context.Regions.OrderBy(a => a.Name).ToListAsync();
            var regionsToReturn = new List<RegionForDetailDto>();
            foreach (var region in allRegions)
            {
                var r = new RegionForDetailDto
                {
                    Id = region.Id,
                    Name = region.Name,
                    Code = region.Code,
                    Departments = new List<DepartmentForDetailDto>()

                };
                var departments = allDepartments.Where(d => d.RegionId == region.Id).OrderBy(d => d.Name).ToList();
                foreach (var dept in departments)
                {
                    var d = new DepartmentForDetailDto()
                    {
                        Id = dept.Id,
                        Name = dept.Name,
                        Code = dept.Code,
                        RegionId = dept.RegionId,
                        Cities = new List<CityForDetailDto>()
                    };

                    var deptCities = allCities.Where(c => c.DepartmentId == dept.Id);
                    foreach (var c in deptCities)
                    {

                        var cityOps = allOperators.Where(a => a.ResCityId == c.Id).ToList();
                        int t = cityOps.Count();
                        var cc = new CityForDetailDto
                        {
                            Id = c.Id,
                            Name = c.Name,
                            Code = c.Code,
                            DepartmentId = c.DepartmentId,
                            NbEmpNeeded = c.NbEmpNeeded,
                            TotalRegistered = t,
                            // PrctRegistered = Math.Round(100 * ((double)t / (double)(c.NbEmpNeeded * inscrpitionQuota)), 2),
                            // PrctRegistered = 100 * (t / (c.NbEmpNeeded * inscrpitionQuota)),
                            TotalRegisteredPrct = Convert.ToInt32(c.NbEmpNeeded * inscrpitionQuota),
                            TotalReserveToHave = Convert.ToInt32((c.NbEmpNeeded * inscrpitionQuota) - c.NbEmpNeeded)
                        };
                        if (cc.TotalRegisteredPrct > 0)
                            cc.PrctRegistered = (100 * t) / (cc.TotalRegisteredPrct);
                        if (cc.PrctRegistered < 65)
                            recap.RedCities++;
                        if (cc.PrctRegistered >= 65 && cc.PrctRegistered < 90)
                            recap.OrangeCities++;
                        if (cc.PrctRegistered >= 90 && cc.PrctRegistered < 100)
                            recap.BleuCities++;
                        if (cc.PrctRegistered >= 100)
                            recap.GreenCities++;

                        d.Cities.Add(cc);
                        d.TotalRegistered += t;
                        d.NbEmpNeeded += c.NbEmpNeeded;
                        d.TotalRegisteredPrct = Convert.ToInt32(d.NbEmpNeeded * inscrpitionQuota);
                        d.TotalReserveToHave = Convert.ToInt32((d.NbEmpNeeded * inscrpitionQuota) - d.NbEmpNeeded);
                    }
                    if (d.TotalRegisteredPrct > 0)
                        d.PrctRegistered = (d.TotalRegistered * 100) / d.TotalRegisteredPrct;
                    r.Departments.Add(d);
                    r.NbEmpNeeded += d.NbEmpNeeded;
                    r.TotalRegistered += d.TotalRegistered;
                    r.TotalRegisteredPrct = Convert.ToInt32(r.NbEmpNeeded * inscrpitionQuota);
                    r.TotalReserveToHave = Convert.ToInt32((r.NbEmpNeeded * inscrpitionQuota) - r.NbEmpNeeded);

                }
                if (r.TotalRegisteredPrct > 0)
                    r.PrctRegistered = (r.TotalRegistered * 100) / r.TotalRegisteredPrct;
                regionsToReturn.Add(r);
            }
            return Ok(new
            {
                regions = regionsToReturn,
                recap = recap
            });
        }




        [HttpGet("{regionId}/GetRegionRegistrationDetails")]
        public async Task<IActionResult> GetRegionRegistrationDetails(int regionId)
        {
            var inscrpitionQuota = (await _context.Quotas.FirstOrDefaultAsync(a => a.Id == _config.GetValue<int>("AppSettings:InscriptionQuota"))).Percentage;
            var region = await _context.Regions.FirstOrDefaultAsync(r => r.Id == regionId);
            var ops = await _context.Users.Where(a => a.RegionId == regionId && a.TypeEmpId == operatorTypeId).ToListAsync();
            var depts = await _context.Departments.Where(d => d.RegionId == regionId).OrderBy(a => a.Name).ToListAsync();
            var cities = await _context.Cities.Where(r => r.Department.RegionId == regionId).OrderBy(a => a.Name).ToListAsync();
            var regionToReturn = new RegionForDetailDto
            {
                Id = region.Id,
                Name = region.Name,
                Code = region.Code,
                Departments = new List<DepartmentForDetailDto>()
            };
            // var departments = new List<DepartmentForDetailDto>();
            foreach (var dept in depts)
            {
                var d = new DepartmentForDetailDto()
                {
                    Id = dept.Id,
                    Name = dept.Name,
                    Code = dept.Code,
                    RegionId = dept.RegionId,
                    Cities = new List<CityForDetailDto>()
                };

                var deptCities = cities.Where(c => c.DepartmentId == dept.Id);
                foreach (var c in deptCities)
                {

                    var cityOps = ops.Where(a => a.ResCityId == c.Id).ToList();
                    int t = cityOps.Count();
                    // d.Cities.Add(new CityForDetailDto
                    // {
                    //     Id = c.Id,
                    //     Name = c.Name,
                    //     Code = c.Code,
                    //     DepartmentId = c.DepartmentId,
                    //     NbEmpNeeded = c.NbEmpNeeded,
                    //     TotalRegistered = t,
                    //     PrctRegistered = Math.Round(100 * ((double)t / (double)(c.NbEmpNeeded * inscrpitionQuota)), 2),
                    //     TotalRegisteredPrct = Convert.ToInt32(c.NbEmpNeeded * inscrpitionQuota),
                    //     TotalReserveToHave = Convert.ToInt32((c.NbEmpNeeded * inscrpitionQuota) - c.NbEmpNeeded)
                    // });


                    var cc = new CityForDetailDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Code = c.Code,
                        DepartmentId = c.DepartmentId,
                        NbEmpNeeded = c.NbEmpNeeded,
                        TotalRegistered = t,
                        // PrctRegistered = Math.Round(100 * ((double)t / (double)(c.NbEmpNeeded * inscrpitionQuota)), 2),
                        TotalRegisteredPrct = Convert.ToInt32(c.NbEmpNeeded * inscrpitionQuota),
                        TotalReserveToHave = Convert.ToInt32((c.NbEmpNeeded * inscrpitionQuota) - c.NbEmpNeeded)
                    };
                    if (cc.TotalRegisteredPrct > 0)
                        cc.PrctRegistered = (100 * t) / (cc.TotalRegisteredPrct);
                    d.Cities.Add(cc);
                    d.TotalRegistered += t;
                    d.NbEmpNeeded += c.NbEmpNeeded;
                    d.TotalRegisteredPrct = Convert.ToInt32(d.NbEmpNeeded * inscrpitionQuota);
                    d.TotalReserveToHave = Convert.ToInt32((d.NbEmpNeeded * inscrpitionQuota) - d.NbEmpNeeded);
                }
                // d.PrctRegistered = Math.Round(100 * ((double)d.TotalRegistered / (double)(d.NbEmpNeeded * inscrpitionQuota)), 2);
                if (d.TotalRegisteredPrct > 0)
                    d.PrctRegistered = (d.TotalRegistered * 100) / d.TotalRegisteredPrct;
                regionToReturn.Departments.Add(d);
                regionToReturn.NbEmpNeeded += d.NbEmpNeeded;
                regionToReturn.TotalRegistered += d.TotalRegistered;
                regionToReturn.TotalRegisteredPrct = Convert.ToInt32(regionToReturn.NbEmpNeeded * inscrpitionQuota);
                regionToReturn.TotalReserveToHave = Convert.ToInt32((regionToReturn.NbEmpNeeded * inscrpitionQuota) - regionToReturn.NbEmpNeeded);

            }
            regionToReturn.PrctRegistered = Math.Round(100 * ((double)regionToReturn.TotalRegistered / (double)(regionToReturn.NbEmpNeeded * inscrpitionQuota)), 2);
            return Ok(regionToReturn);
        }

        [HttpGet("AllRegions")]
        public async Task<IActionResult> AllRegions()
        {
            var allregions = await _context.Regions.OrderBy(a => a.Name).ToListAsync();
            var allDepartments = await _context.Departments.OrderBy(a => a.Name).ToListAsync();
            var AllCities = await _context.Cities.OrderBy(a => a.Name).ToListAsync();

            var regionsToReturn = new List<RegionForDetailDto>();
            foreach (var region in allregions)
            {
                var r = new RegionForDetailDto
                {
                    Id = region.Id,
                    Code = region.Code,
                    Name = region.Name,
                    ActiveforInscription = region.ActiveforInscription,
                    Departments = new List<DepartmentForDetailDto>()
                };

                var regDepts = allDepartments.Where(n => n.RegionId == region.Id);
                foreach (var dept in regDepts)
                {
                    var deptCities = AllCities.Where(d => d.DepartmentId == dept.Id).ToList();
                    var dp = new DepartmentForDetailDto
                    {
                        Id = dept.Id,
                        Name = dept.Name,
                        Code = dept.Code,
                        ActiveforInscription = dept.ActiveforInscription,
                        Cities = new List<CityForDetailDto>()
                    };

                    foreach (var city in deptCities)
                    {
                        var c = new CityForDetailDto
                        {
                            Id = city.Id,
                            Name = city.Name,
                            Code = city.Code,
                            ActiveforInscription = city.ActiveforInscription,
                            NbEmpNeeded = city.NbEmpNeeded
                        };
                        dp.NbEmpNeeded += city.NbEmpNeeded;
                        dp.Cities.Add(c);
                    }
                    r.Departments.Add(dp);
                    r.NbEmpNeeded = r.Departments.Sum(a => a.NbEmpNeeded);
                }
                regionsToReturn.Add(r);
            }
            return Ok(regionsToReturn);

        }

        [HttpPut("{regionId}/UpdateRegionState")]
        public async Task<IActionResult> UpdateRegionState(int regionId)
        {
            var region = await _context.Regions.FirstOrDefaultAsync(a => a.Id == regionId);
            region.ActiveforInscription = !region.ActiveforInscription;
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPut("{departmentId}/UpdateDepartmentState")]
        public async Task<IActionResult> UpdateDepartmentState(int departmentId)
        {
            var department = await _context.Departments.FirstOrDefaultAsync(a => a.Id == departmentId);
            department.ActiveforInscription = !department.ActiveforInscription;
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPut("{cityid}/UpdateCityState")]
        public async Task<IActionResult> UpdateCityState(int cityid)
        {
            var city = await _context.Cities.FirstOrDefaultAsync(a => a.Id == cityid);
            city.ActiveforInscription = !city.ActiveforInscription;
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPost("{cityid}/UpdateCityQuota/{quota}")]
        public async Task<IActionResult> UpdateCityQuota(int cityid, int quota)
        {
            var city = await _context.Cities.FirstOrDefaultAsync(a => a.Id == cityid);
            city.NbEmpNeeded = quota;
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }

        [HttpPost("{trainingClassId}/AddUsersToClass/{insertUserId}")]
        public async Task<IActionResult> AddUsersToClass(List<UserIdDto> userIds, int insertUserId, int trainingClassId)
        {
            foreach (var userId in userIds)
            {
                var trClass = new EmployeeClass
                {
                    EmployeeId = userId.UserId,
                    TrainingClassId = trainingClassId
                };
                _repo.Add(trClass);

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId.UserId);
                user.OnTraining = true;
                _repo.Update(user);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = userId.UserId,
                    TrainingClassId = trainingClassId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:AddUserToTrainingClassHistorytypeId")
                };
                _repo.Add(uh);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpPost("{trainingClassId}/RemoveUsersToClass/{insertUserId}")]
        public async Task<IActionResult> RemoveUsersToClass(List<int> userIds, int insertUserId, int trainingClassId)
        {
            foreach (var userId in userIds)
            {
                var trClass = await _context.EmployeeClasses.FirstOrDefaultAsync(a => a.EmployeeId == userId && a.TrainingClassId == trainingClassId);
                if (trClass != null)
                    _repo.Delete(trClass);
                var p = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                p.OnTraining = false;
                _repo.Update(p);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = userId,
                    TrainingClassId = trainingClassId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:RemoveUserToTrainingClassHistorytypeId")
                };
                _repo.Add(uh);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpGet("TrainingClassDetails/{trainingClassId}")]
        public async Task<IActionResult> TrainingClassDetails(int trainingClassId)
        {
            var tr = await _context.TrainingClasses.Include(a => a.Department).Include(a => a.City).Include(a => a.Training).Include(a => a.Training).FirstOrDefaultAsync(a => a.Id == trainingClassId);
            if (tr != null)
            {
                var trClass = _mapper.Map<TrainingClassDetailDto>(tr);
                var trainers = await _context.TrainerClasses.Include(a => a.Trainer).Where(a => a.TrainingClassId == trainingClassId).ToListAsync();
                trClass.Trainers = _mapper.Map<List<UserForListDto>>(trainers.Select(t => t.Trainer));
                trClass.TotalParticipants = _context.EmployeeClasses.Where(a => a.TrainingClassId == trainingClassId).Count();
                return Ok(trClass);
            }
            return BadRequest();
        }

        [HttpGet("TrainingClassParticipants/{trainingClassId}")]
        public async Task<IActionResult> TrainingClassParticipants(int trainingClassId)
        {
            var participants = await _context.EmployeeClasses.Where(a => a.TrainingClassId == trainingClassId).ToListAsync();
            var userIds = participants.Select(a => a.EmployeeId).ToList();
            var users = await _context.Users.Include(p => p.TypeEmp)
                                                        .Include(p => p.Region)
                                                        .Include(p => p.Department)
                                                        .Include(p => p.ResCity)
                                                        .Where(p => userIds.Contains(p.Id))
                                                        .OrderBy(p => p.LastName)
                                                        .ThenBy(p => p.FirstName)
                                                        .ToListAsync();
            if (users.Count() > 0)
            {
                var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
                return Ok(usersToReturn);
            }
            return BadRequest();
        }

        [HttpPut("{trainingClassId}/DeleteTrainingClass/{insertUserId}")]
        public async Task<IActionResult> DeleteTrainingClass(int trainingClassId, int insertUserId)
        {
            var trainingClass = await _context.TrainingClasses.FirstOrDefaultAsync(p => p.Id == trainingClassId);
            if (trainingClass != null)
            {
                trainingClass.Active = false;
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    TrainingClassId = trainingClassId,
                    TrainingId = trainingClass.TrainingId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:DeleteTrainingClassHistorytypeId")
                };
                _repo.Add(uh);
                if (await _repo.SaveAll())
                    return Ok();

                return BadRequest();

            }
            return NotFound();
        }
        [HttpPut("{trainingClassId}/CloseTrainingClass/{insertUserId}")]
        public async Task<IActionResult> CloseTrainingClass(int trainingClassId, int insertUserId)
        {
            var trainingClass = await _context.TrainingClasses.FirstOrDefaultAsync(t => t.Id == trainingClassId);
            if (trainingClass != null)
            {
                var participants = await _context.EmployeeClasses.Include(e => e.Employee)
                                                                 .Where(c => c.TrainingClassId == trainingClassId)
                                                                 .Select(c => c.Employee)
                                                                 .ToListAsync();
                foreach (var user in participants)
                {
                    user.Trained = true;
                    _repo.Update(user);
                }

                trainingClass.Status = 1;
                _repo.Update(trainingClass);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    TrainingClassId = trainingClassId,
                    TrainingId = trainingClass.TrainingId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:CloseTrainingClassHistorytypeId")
                };
                _repo.Add(uh);
                if (await _repo.SaveAll())
                    return Ok();

                return BadRequest();
            }
            return NotFound();
        }

        [HttpPost("TrainedUsers")]
        public async Task<IActionResult> TrainedUsers(TrainedUserSearchDto model)
        {
            var employeeClasses = await _context.EmployeeClasses.Include(t => t.TrainingClass)
                                                                .Include(t => t.Employee)
                                                                .Include(t => t.Employee.Region)
                                                                .Include(t => t.Employee.Department)
                                                                .Include(t => t.Employee.ResCity)
                                                                .Where(t => t.TrainingClass.RegionId == model.RegionId && t.Employee.Trained == true)
                                                                .ToListAsync();
            if (model.TrainingClassId != null)
            {
                var users = employeeClasses.Where(t => t.TrainingClassId == Convert.ToInt32(model.TrainingClassId))
                                            .Select(t => t.Employee)
                                            .OrderBy(t => t.LastName)
                                            .ThenBy(t => t.FirstName);
                var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
                return Ok(usersToReturn);
            }
            else if (model.TrainingId != null)
            {
                var users = employeeClasses.Where(t => t.TrainingClass.TrainingId == Convert.ToInt32(model.TrainingId))
                                                        .Select(t => t.Employee)
                                                        .OrderBy(t => t.LastName)
                                                        .ThenBy(t => t.FirstName);
                var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
                return Ok(usersToReturn);
            }

            else
            {
                var users = employeeClasses.Select(t => t.Employee)
                                            .OrderBy(t => t.LastName)
                                            .ThenBy(t => t.FirstName);
                var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
                return Ok(usersToReturn);
            }
        }

        [HttpPost("SelectUsers/{insertUserId}")]
        public async Task<IActionResult> SelectUsers(List<int> userIds, int insertUserId)
        {
            foreach (var userId in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
                if (user != null)
                    user.Selected = true;
                _repo.Update(user);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = userId,
                    // TrainingClassId = trainingClassId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:SelectUserHistorytypeId")
                };
                _repo.Add(uh);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpPost("UnSelectUsers/{insertUserId}")]
        public async Task<IActionResult> UnSelectUsers(List<int> userIds, int insertUserId)
        {
            foreach (var userId in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
                if (user != null)
                    user.Selected = false;
                _repo.Update(user);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = userId,
                    // TrainingClassId = trainingClassId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:UnSelectUserHistorytypeId")
                };
                _repo.Add(uh);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpPost("ReserveUsers/{insertUserId}")]
        public async Task<IActionResult> ReserveUsers(List<int> userIds, int insertUserId)
        {
            foreach (var userId in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
                if (user != null)
                    user.Reserved = true;
                _repo.Update(user);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = userId,
                    // TrainingClassId = trainingClassId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:ReserveUserHistorytypeId")
                };
                _repo.Add(uh);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpPost("UnReserveUsers/{insertUserId}")]
        public async Task<IActionResult> UnReserveUsers(List<int> userIds, int insertUserId)
        {
            foreach (var userId in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
                if (user != null)
                    user.Reserved = false;
                _repo.Update(user);
                var uh = new UserHistory
                {
                    InsertUserId = insertUserId,
                    UserId = userId,
                    // TrainingClassId = trainingClassId,
                    UserHistoryTypeId = _config.GetValue<int>("AppSettings:UnReserveUserHistorytypeId")
                };
                _repo.Add(uh);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }

        [HttpGet("TrainingClassStatus/{trainingClassId}")]
        public async Task<IActionResult> TrainingClassStatus(int trainingClassId)
        {
            var trainingClass = await _context.TrainingClasses.FirstOrDefaultAsync(r => r.Id == trainingClassId);
            if (trainingClass != null)
                return Ok(trainingClass.Status);

            return NotFound();
        }

        [HttpGet("VerifytrainerClass/{trainerId}/{trainingClassId}")]
        public async Task<IActionResult> TrainingClassStatus(int trainerId, int trainingClassId)
        {
            var trainerClass = await _context.TrainerClasses.FirstOrDefaultAsync(r => r.TrainingClassId == trainingClassId && r.TrainerId == trainerId);
            if (trainerClass != null)
                return Ok(true);

            return Ok(false);
        }
        [HttpPost("SearchEmployees")]
        public async Task<IActionResult> SearchEmployees(EmpSearchModelDto searchModel)
        {
            var users = new List<User>();
            string req = "select * from AspnetUsers  where Id <> 1 and LastName + ' ' + firstName Like '%" + searchModel.EmpName + "%'";
            if (searchModel.TypeEmpId != null)
                req += " and TypeEmpId=" + Convert.ToInt32(searchModel.TypeEmpId);
            if (searchModel.RegionId != null)
                req += "and RegionId =" + Convert.ToInt32(searchModel.RegionId);
            if (searchModel.DepartmentId != null)
                req += "and DepartmentId =" + Convert.ToInt32(searchModel.DepartmentId);
            if (searchModel.ResCityId != null)
                req += "and ResCityId =" + Convert.ToInt32(searchModel.ResCityId);

            users = await _context.Users.Include(a => a.TypeEmp)
                                        .Include(a => a.Photos)
                                        .Include(a => a.Region)
                                        .Include(a => a.Department)
                                        .Include(a => a.ResCity)
                                        .Include(a => a.StudyLevel)
                                        .Include(a => a.EducationalTrack)
                                        .FromSql(req)
                                        .OrderBy(a => a.LastName)
                                        .ThenBy(a => a.FirstName)
                                        .ToListAsync();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("EmployeeDetails/{userId}")]
        public async Task<IActionResult> EmployeeDetails(int userId)
        {
            CultureInfo frC = new CultureInfo("fr-FR");
            var user = await _context.Users.Include(a => a.Region)
                                            .Include(a => a.TypeEmp)
                                            .Include(a => a.Department)
                                            .Include(a => a.ResCity)
                                            .Include(a => a.Municipality)
                                            .Include(a => a.EnrolmentCenter)
                                            .Include(a => a.Tablet)
                                            .Include(a => a.Photos)
                                            .FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                var userToReturn = _mapper.Map<UserForListDto>(user);
                if (userToReturn.Step == 1)
                    userToReturn.Details = "Pré-sélectionné(e)";
                else
                {
                    var trainingClass = (await _context.EmployeeClasses.Include(a => a.TrainingClass)
                                                                        .Include(a => a.TrainingClass.Region)
                                                                        .Include(a => a.TrainingClass.Department)
                                                                        .Include(a => a.TrainingClass.City)
                                                                        .Include(a => a.TrainingClass.Training)
                                                                        .FirstOrDefaultAsync(a => a.EmployeeId == userId));
                    if (userToReturn.Step == 2)
                        userToReturn.Details = "Programmé(e) pour formation.";
                    if (userToReturn.Step == 3)
                        userToReturn.Details = "Formé(e):";
                    if (userToReturn.Step == 4 && userToReturn.Reserved == true)
                        userToReturn.Details = "Réserviste:";
                    if (userToReturn.Step == 4 && userToReturn.Selected == true)
                        userToReturn.Details = "Sélectionné(e):";
                    if (userToReturn.Step >= 4 && userToReturn.Active == true)
                        userToReturn.Details = "En activité:";

                    if (trainingClass != null)
                    {
                        userToReturn.Details += " (" + trainingClass.TrainingClass.Training.Name + " du " + trainingClass.TrainingClass.StartDate.ToString("dd/MM/yyyy", frC)
                         + ". Lieu de la formation " + trainingClass.TrainingClass.Department.Name + " - " + trainingClass.TrainingClass.City.Name + ")";
                    }
                }
                return Ok(userToReturn);
            }
            return NotFound();
        }
        [HttpPost("ReAssignOps/{cityId}/{departmentId}")]
        public async Task<IActionResult> ReAssignOps(int departmentId, int cityId, List<int> userIds)
        {
            foreach (var userId in userIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
                user.ResCityId = cityId;
                user.DepartmentId = departmentId;
                _repo.Update(user);
            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest();
        }


        [HttpPost("RemoveOps")]
        public async Task<IActionResult> RemoveOps(List<int> userIds)
        {
            foreach (var userId in userIds)
            {
                var h = await _context.UserHistories.FirstOrDefaultAsync(a => a.UserId == userId);
                if (h != null)
                    _repo.Delete(h);

                var photos = await _context.Photos.Where(u => u.UserId == userId).ToListAsync();
                foreach (var photo in photos)
                {
                    if (photo.PublicId != null)
                    {
                        var deleteParams = new DeletionParams(photo.PublicId);

                        var result = _cloudinary.Destroy(deleteParams);

                        if (result.Result == "ok")
                        {
                            _context.Photos.Remove(photo);
                        }
                    }

                    if (photo.PublicId == null)
                    {
                        _context.Photos.Remove(photo);
                    }
                }
                _context.Photos.RemoveRange(photos);

                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
                _repo.Delete(user);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest();
        }


        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            // if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();

            var userFromRepo = await _repo.GetUser(id, true);

            _mapper.Map(userForUpdateDto, userFromRepo);
            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating user {id} failed on save");
        }


    }

}