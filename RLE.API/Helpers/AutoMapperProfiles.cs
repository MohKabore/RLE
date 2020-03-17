using System;
using System.Globalization;
using System.Linq;
using AutoMapper;
using RLE.API.Data;
using RLE.API.Dtos;
using RLE.API.Models;

namespace RLE.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        private readonly DataContext _context;
        CultureInfo frC = new CultureInfo("fr-FR");

        public AutoMapperProfiles(DataContext context)
        {
            _context = context;
            
        }
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.CalculateAge());
                })
                .ForMember(dest => dest.DateOfBirth, opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.ToString("dd/MM/yyyy", frC));
                })
                .ForMember(dest => dest.Step, opt =>
                {
                    opt.MapFrom(src =>
                    Convert.ToInt32(src.PreSelected) + Convert.ToInt32(src.Selected) + Convert.ToInt32(src.OnTraining)
                        + Convert.ToInt32(src.Trained) + Convert.ToInt32(src.Hired) + Convert.ToInt32(src.Reserved));
                });

            CreateMap<EnrolmentCenter, EcsForListDto>()
            .ForMember(dest => dest.DisplayCode, opt =>
            {
                opt.MapFrom(src => src.Municipality.City.Department.Region.Code +"-" + src.Municipality.City.Department.Code +"-"
                            + src.Municipality.City.Code +"-"  + src.Municipality.Code +"-" + src.Code);
            })
            ;


            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<TrainingCreationDto, Training>();
            CreateMap<TrainingForUpdateDto, Training>();
            CreateMap<TrainingClassCreationDto, TrainingClass>();
            CreateMap<CityUpdateDto, City>();
            CreateMap<TrainingClass, TrainingClassDetailDto>()
            .ForMember(dest => dest.StartDate, opt =>
            {
                opt.MapFrom(src => src.StartDate.ToString("dd/MM/yyyy", frC));
            })
            .ForMember(dest => dest.EndDate, opt =>
            {
                opt.MapFrom(src => src.EndDate.ToString("dd/MM/yyyy", frC));
            });


            // CreateMap<User, UserForAutoCompleteDto>()
            //     .ForMember (dest => dest.ClassName, opt => {
            //         opt.MapFrom (src => src.Class.Name);
            //     })
            //     .ForMember (dest => dest.UserTypeName, opt => {
            //         opt.MapFrom (src => src.UserType.Name);
            //     });

            // CreateMap<User, UserForCallSheetDto>()
            //     .ForMember (dest => dest.PhotoUrl, opt => {
            //         opt.MapFrom (src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            //     });
            // CreateMap<User, UserForDetailedDto>()
            //     .ForMember(dest => dest.PhotoUrl, opt => {
            //         opt.MapFrom (src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            //     })
            //     .ForMember(dest => dest.Age, opt => {
            //         opt.MapFrom (d => d.DateOfBirth.CalculateAge());
            //     })
            //     .ForMember(dest => dest.ClassName, opt => {
            //         opt.MapFrom (src => src.Class.Name);
            //     });
            // CreateMap<User, UserForAccountDto>()
            //     .ForMember(dest => dest.PhotoUrl, opt => {
            //         opt.MapFrom (src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            //     })
            //     .ForMember (dest => dest.Age, opt => {
            //         opt.MapFrom (d => d.DateOfBirth.CalculateAge());
            //     })
            //     .ForMember(dest => dest.ClassName, opt => {
            //         opt.MapFrom (src => src.Class.Name);
            //     })
            //     .ForMember(dest => dest.UserTypeName, opt => {
            //         opt.MapFrom(src => src.UserType.Name);
            //     });
            // CreateMap<Class, ClassDetailDto>()
            //     .ForMember(dest => dest.TotalStudent, opt => {
            //         opt.MapFrom (src => src.Students.Count());
            //     });
            // CreateMap<Evaluation, EvalsForEditDto>()
            //     .ForMember (dest => dest.EvalDateExpired, opt => {
            //         opt.MapFrom (src => (src.EvalDate.Date <= DateTime.Now.Date));
            //     });
            // CreateMap<Photo, PhotosForDetailedDto> ();
            // CreateMap<UserForUpdateDto, User> ();
            // CreateMap<Photo, PhotoForReturnDto> ();
            // CreateMap<PhotoForCreationDto, Photo> ();
            // CreateMap<UserForRegisterDto, User> ();
            // CreateMap<UserFromExelDto, User> ();
            // CreateMap<MessageForCreationDto, Message> ().ReverseMap ();
            // CreateMap<Message, MessageToReturnDto> ()
            //     .ForMember (m => m.SenderPhotoUrl, opt => opt
            //         .MapFrom (u => u.Sender.Photos.FirstOrDefault (p => p.IsMain).Url))
            //     .ForMember (m => m.RecipientPhotoUrl, opt => opt
            //         .MapFrom (u => u.Recipient.Photos.FirstOrDefault (p => p.IsMain).Url));
            // CreateMap<Schedule, ScheduleForTimeTableDto> ()
            //     .ForMember (dest => dest.TeacherName, opt => {
            //         opt.MapFrom (src => src.Teacher.LastName + ' ' + src.Teacher.FirstName);
            //     })
            //     .ForMember (dest => dest.StartHourMin, opt => {
            //         opt.MapFrom (d => d.StartHourMin.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.EndHourMin, opt => {
            //         opt.MapFrom (d => d.EndHourMin.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.Top, opt => {
            //         opt.MapFrom (d => d.StartHourMin.CalculateTop ());
            //     })
            //     .ForMember (dest => dest.Height, opt => {
            //         opt.MapFrom (d => d.StartHourMin.CalculateHeight (d.EndHourMin));
            //     })
            //     .ForMember (dest => dest.Color, opt => opt
            //         .MapFrom (src => src.Course.Color))
            //     .ForMember (s => s.ClassLevel, opt => opt
            //         .MapFrom (d => d.Class.ClassLevel.Name));
            // CreateMap<Schedule, ClassScheduleForTimeTableDto> ()
            //     .ForMember (dest => dest.StartHourMin, opt => {
            //         opt.MapFrom (d => d.StartHourMin.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.EndHourMin, opt => {
            //         opt.MapFrom (d => d.EndHourMin.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.Top, opt => {
            //         opt.MapFrom (d => d.StartHourMin.CalculateTop ());
            //     })
            //     .ForMember (dest => dest.Height, opt => {
            //         opt.MapFrom (d => d.StartHourMin.CalculateHeight (d.EndHourMin));
            //     })
            //     .ForMember (dest => dest.Color, opt => opt
            //         .MapFrom (src => src.Course.Color))
            //     .ForMember (s => s.ClassLevel, opt => opt
            //         .MapFrom (d => d.Class.ClassLevel.Name));
            // CreateMap<Schedule, ScheduleToReturnDto> ()
            //     .ForMember (dest => dest.strStartHourMin, opt => {
            //         opt.MapFrom (d => d.StartHourMin.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.strEndHourMin, opt => {
            //         opt.MapFrom (d => d.EndHourMin.ToShortTimeString ());
            //     });
            // CreateMap<Schedule, SessionsToReturnDto> ();
            // CreateMap<AgendaForSaveDto, Agenda> ();
            // CreateMap<AbsenceForSaveDto, Absence> ();
            // CreateMap<Absence, AbsencesToReturnDto> ()
            //     .ForMember (dest => dest.StartDate, opt => {
            //         opt.MapFrom (src => src.StartDate.ToShortDateString ());
            //     })
            //     .ForMember (dest => dest.StartTime, opt => {
            //         opt.MapFrom (src => src.StartDate.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.EndDate, opt => {
            //         opt.MapFrom (src => src.EndDate.ToShortDateString ());
            //     })
            //     .ForMember (dest => dest.EndTime, opt => {
            //         opt.MapFrom (src => src.EndDate.ToShortTimeString ());
            //     })
            //     .ForMember (dest => dest.AbsenceType, opt => opt
            //         .MapFrom (src => src.AbsenceType.Name))
            //     .ForMember (dest => dest.UserName, opt => opt
            //         .MapFrom (src => src.User.LastName + ' ' + src.User.FirstName))
            //     .ForMember (dest => dest.Justified, opt => {
            //         opt.MapFrom (src => src.Justified == true ? "OUI" : "NON");
            //     });
            // CreateMap<UserSanction, UserSanctionsToReturnDto> ()
            //     .ForMember (dest => dest.SanctionDate, opt => {
            //         opt.MapFrom (src => src.SanctionDate.ToShortDateString ());
            //     })
            //     .ForMember (dest => dest.SanctionName, opt => {
            //         opt.MapFrom (src => src.Sanction.Name);
            //     })
            //     .ForMember (dest => dest.UserName, opt => opt
            //         .MapFrom (src => src.User.LastName + ' ' + src.User.FirstName))
            //     .ForMember (dest => dest.SanctionedBy, opt => opt
            //         .MapFrom (src => src.SanctionedBy.LastName + ' ' + src.SanctionedBy.FirstName));
            // CreateMap<Evaluation, EvaluationForListDto> ()
            //     .ForMember (dest => dest.CourseAbbrev, opt => {
            //         opt.MapFrom (src => src.Course.Abbreviation);
            //     })
            //     .ForMember (dest => dest.CourseColor, opt => {
            //         opt.MapFrom (src => src.Course.Color);
            //     })
            //     .ForMember (dest => dest.EvalDate, opt => {
            //         opt.MapFrom (src => src.EvalDate.ToString ("dd/MM/yy"));
            //     });
            // CreateMap<ProductDto, Product> ();
            // CreateMap<DeadLineDto, DeadLine> ();
            // CreateMap<PayableDto, PayableAt> ();
            // CreateMap<CreateCoefficientDto, CourseCoefficient> ();
            // CreateMap<CourseCoefficient, CoefficientDetailsDto> ()
            //     .ForMember (dest => dest.ClassLevelName, opt => {
            //         opt.MapFrom (src => src.ClassLevel.Name);
            //     })
            //     .ForMember (dest => dest.CourseName, opt => {
            //         opt.MapFrom (src => src.Course.Name);
            //     })
            //     .ForMember (dest => dest.ClassTypeName, opt => {
            //         opt.MapFrom (src => src.ClassType.Name);
            //     });

            //     CreateMap<DeadLine, DealLineDetailsDto> ()
            //     .ForMember (dest => dest.DueDate, opt => {
            //         opt.MapFrom (src => src.DueDate.ToShortDateString());
            //     });



        }
    }
}