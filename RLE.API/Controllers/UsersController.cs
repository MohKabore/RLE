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

namespace RLE.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IEducNotesRepository _repo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        string password;

        private readonly UserManager<User> _userManager;
        int operatorTypeId;

        public UsersController(IConfiguration config, DataContext context, IEducNotesRepository repo,
        UserManager<User> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _config = config;
            _context = context;
            _repo = repo;
            _mapper = mapper;
            password = _config.GetValue<String>("AppSettings:defaultPassword");
            operatorTypeId = _config.GetValue<int>("AppSettings:OperatorTypeId");
        }
        [HttpPost("SearchNewEmps")]
        public async Task<IActionResult> SearchNewEmps(EmpSearchModelDto searchModel)
        {
            var users = new List<User>();
            string req = "select * from AspnetUsers where LastName + ' ' + firstName Like '%" + searchModel.EmpName + "%'" +
            " and Active=0 and PreSelected=0 and TypeEmpId=" + Convert.ToInt32(searchModel.TypeEmpId);
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
                        content = $"veuillez creer votre compte au lien suiant : <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicker ici</a>.",
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
                    TotalClasses = tr.TrainingClasses.Count()
                };
                var classIds = tr.TrainingClasses.Select(a => a.Id);
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
                var trainingClasses = await _context.TrainingClasses.Where(a => a.TrainingId == trainingId)
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

        // [HttpGet("AllRegionOpDetails")]
        // public async Task<IActionResult> AllRegionOpDetails()
        // {
        //     var quotas = await _context.Quotas.ToListAsync();
        //     var inscrpitionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:InscriptionQuota")).Percentage;
        //     var preselectionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:PreselectionQuota")).Percentage;
        //     var onTrainingQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:FormationQuota")).Percentage;
        //     var selectionQuota = quotas.FirstOrDefault(a => a.Id == _config.GetValue<int>("AppSettings:SelectionQuota")).Percentage;
        //     var allDepartments = await _context.Departments.ToArrayAsync();
        //     var allCities = await _context.Cities.ToArrayAsync();
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
        //         var departments = allDepartments.Where(d => d.RegionId == region.Id).ToList();
        //         foreach (var dept in departments)
        //         {
        //             var d = new CityForDetailDto();

        //             var cities = allCities.Where(re => re.DepartmentId == dept.Id)
        //                                                     .OrderBy(a => a.Name);
        //             foreach (var city in cities)
        //             {
        //                 var operators = allOperators.Where(u => u.ResCityId == city.Id);
        //                 var c = new CityForDetailDto
        //                 {
        //                     TotalRegistered = operators.Where(a => a.PreSelected == false).Count(),
        //                     TotalPreSelected = operators.Where(a => a.PreSelected == true).Count(),
        //                     TotalOnTraining = operators.Where(a => a.OnTraining == true).Count(),
        //                     TotalSelected = operators.Where(a => a.Selected == true).Count(),
        //                     NbEmpNeeded = city.NbEmpNeeded,
        //                 };
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
            var allOperators = await _context.Users.Where(u => u.TypeEmpId == operatorTypeId).ToListAsync();


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
                        Code = dept.Code

                    };

                    var cities = allCities.Where(re => re.DepartmentId == dept.Id)
                                                            .OrderBy(a => a.Name);
                    foreach (var city in cities)
                    {
                        var operators = allOperators.Where(u => u.ResCityId == city.Id);
                        var c = new CityForDetailDto
                        {
                            Id = city.Id,
                            Name = city.Name,
                            Code = city.Code,
                            TotalRegistered = operators.Count(),
                            TotalPreSelected = operators.Where(a => a.PreSelected == true).Count(),
                            TotalOnTraining = operators.Where(a => a.OnTraining == true).Count(),
                            TotalSelected = operators.Where(a => a.Selected == true).Count(),
                            NbEmpNeeded = city.NbEmpNeeded,
                        };
                        d.TotalSelected += c.TotalSelected;
                        d.TotalOnTraining += c.TotalOnTraining;
                        d.TotalPreSelected += c.TotalPreSelected;
                        d.TotalRegistered += c.TotalRegistered;
                        d.NbEmpNeeded += c.NbEmpNeeded;
                    }
                    r.TotalOnTraining += d.TotalOnTraining;
                    r.TotalPreSelected += d.TotalPreSelected;
                    r.TotalRegistered += d.TotalRegistered;
                    r.TotalSelected += d.TotalSelected;
                    r.NbEmpNeeded += d.NbEmpNeeded;
                    r.PrctRegistered = Math.Round(100 * ((double)r.TotalRegistered / (double)(r.NbEmpNeeded * inscrpitionQuota)), 2);
                    r.PrctPreselected = Math.Round(100 * ((double)r.TotalPreSelected / (double)(r.NbEmpNeeded * preselectionQuota)), 2);
                    r.PrctOnTraining = Math.Round(100 * ((double)r.TotalOnTraining / (double)(r.NbEmpNeeded * onTrainingQuota)), 2);
                    r.PrctSelected = Math.Round(100 * ((double)r.TotalSelected / (double)(r.NbEmpNeeded * selectionQuota)), 2);
                }
                regionsToReturn.Add(r);
            }
            return Ok(regionsToReturn);
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
                    d.Cities.Add(new CityForDetailDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Code = c.Code,
                        DepartmentId = c.DepartmentId,
                        NbEmpNeeded = c.NbEmpNeeded,
                        TotalRegistered = cityOps.Count(),
                        PrctRegistered = Math.Round(100 * ((double)cityOps.Count() / (double)(c.NbEmpNeeded * inscrpitionQuota)), 2)
                    });
                    int t = cityOps.Count();

                    d.TotalRegistered += cityOps.Count();
                    d.NbEmpNeeded += c.NbEmpNeeded;
                }
                d.PrctRegistered = Math.Round(100 * ((double)d.TotalRegistered / (double)(d.NbEmpNeeded * inscrpitionQuota)), 2);
                regionToReturn.Departments.Add(d);
                regionToReturn.NbEmpNeeded += d.NbEmpNeeded;
                regionToReturn.TotalRegistered += d.TotalRegistered;
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
            var userIds = participants.Select(a=>a.EmployeeId).ToList();
            var users = await _context.Users.Include(p => p.TypeEmp)
                                                       .Include(p => p.Region)
                                                       .Include(p => p.Department)
                                                       .Include(p => p.ResCity)
                                                       .Where(t => userIds.Contains(t.Id))
                                                       .ToListAsync();
            if (users.Count() > 0)
            {
                var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
                return Ok(usersToReturn);
            }
            return BadRequest();
        }

    }
}