using System;
using System.Collections.Generic;
using System.Linq;
using RLE.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace RLE.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {


            if (!userManager.Users.Any())
            {
                // var userData = System.IOvi.File.ReadAllText("Data/UserSeedData.json");
                // var users = JsonConvert.DeserializeObject<List<User>>(userData);

                var districtsData = System.IO.File.ReadAllText("Data/districts.json");
                var districts = JsonConvert.DeserializeObject<List<District>>(districtsData);
                foreach (var district in districts)
                {
                    var newDistrict = new District
                    {
                        Name = district.Name
                    };
                    context.Add(newDistrict);
                    foreach (var region in district.Regions)
                    {
                        var newRegion = new Region
                        {
                            Name = region.Name,
                            Code = region.Code,
                            DistrictId = newDistrict.Id,
                            Active = 1,
                            ActiveforInscription = true
                        };
                        context.Add(newRegion);
                        foreach (var dept in region.Departments)
                        {
                            var newDept = new Department
                            {
                                Name = dept.Name,
                                RegionId = newRegion.Id,
                                Code = dept.Code,
                                Active = 1,
                                ActiveforInscription = true
                            };
                            context.Add(newDept);
                            foreach (var city in dept.Cities)
                            {
                                var newCity = new City
                                {
                                    Name = city.Name,
                                    Code = city.Code,
                                    CityTypeId = null,
                                    DepartmentId = newDept.Id,
                                    Kits = 0,
                                    PollingPlaces = 0,
                                    NbEmpNeeded = city.NbEmpNeeded,
                                    Active = 1,
                                    ActiveforInscription = true
                                };
                                context.Add(newCity);
                                foreach (var mun in city.Municipalities)
                                {
                                    var newMun = new Municipality
                                    {
                                        CityId = newCity.Id,
                                        Name = mun.Name,
                                        Code = mun.Code,
                                        PollingPlaces = 0
                                    };
                                    context.Add(newMun);
                                    foreach (var ec in mun.EnrolmentCenters)
                                    {
                                        var newEc = new EnrolmentCenter
                                        {
                                            MunicipalityId = newMun.Id,
                                            Code = ec.Code,
                                            Name = ec.Name
                                        };
                                        context.Add(newEc);
                                    }
                                }
                            }
                        }
                    }
                }
                //    context.AddRange(regions);
                context.SaveChanges();


                var roles = new List<Role> {
                    new Role { Name = "Supervisor" },
                    new Role { Name = "Maintenancier" },
                    new Role { Name = "Operateur" },
                    new Role { Name = "AgentCollecte" },
                    new Role { Name = "AgentHotline" },
                    new Role { Name = "Admin" },
                    new Role { Name = "SuperAdmin" }

                };

                foreach (var role in roles)
                {
                    roleManager.CreateAsync(role).Wait();
                }

                var adminUser = new User
                {
                    UserName = "Admin",
                    FirstName = "admin",
                    LastName = "admin",
                    Email = "adminUser@RLE.com",
                    EmailConfirmed = true,
                    ValidatedCode = true
                };

                IdentityResult result = userManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = userManager.FindByNameAsync("Admin").Result;
                    userManager.AddToRolesAsync(admin, new[] { "Admin", "SuperAdmin" }).Wait();
                }

                var uht = new List<UserHistoryType> {
                    new UserHistoryType{Name="Création de compte"},// position 1
                    new UserHistoryType{Name="Envoi lien d'activation"},// position 2
                    new UserHistoryType{Name="Pré-selection"},// position 3
                    new UserHistoryType{Name="Annuler Pré-selection"},// position 4
                    new UserHistoryType{Name="Creation formation"},// position 5
                    new UserHistoryType{Name="Edition formation"},// position 6
                    new UserHistoryType{Name="Suppression formation"},// position 7
                    new UserHistoryType{Name="Création Salle de formation"},// position 8
                    new UserHistoryType{Name="Modification Salle formation"},// position 9
                    new UserHistoryType{Name="Suppression Salle de formation"},// position 10
                    new UserHistoryType{Name="Ajouter utilisateur a une salle de formation"},// position 11
                    new UserHistoryType{Name="Rétirer utilisateur a une salle de formation"}// position 10
                };
                context.AddRange(uht);

                var quotas = new List<Quota> {
                    new Quota {Name = "Inscription", Percentage = 3},
                    new Quota {Name = "Pré-selection", Percentage = 20},
                    new Quota {Name = "Formation", Percentage = 15},
                    new Quota {Name = "Selection", Percentage = 10},
                };
                context.AddRange(quotas);


                var typeEmps = new List<TypeEmp> {
                    new TypeEmp {Name ="Supervisor", WebHired = 0},
                    new TypeEmp {Name ="Formateur", WebHired = 0},
                    new TypeEmp {Name ="Opérateur", WebHired = 0},
                    new TypeEmp {Name ="Agent Collecte", WebHired = 0},
                    new TypeEmp {Name ="Agent Hotline", WebHired = 0},
                    new TypeEmp {Name ="Opérateur Central", WebHired = 0},
                    new TypeEmp {Name ="Technicien", WebHired = 0},
                    new TypeEmp {Name ="Admin", WebHired = 0},
                    new TypeEmp {Name ="Admin Senior", WebHired = 0},
                    new TypeEmp {Name ="Manutentionnaire", WebHired = 0},
                    new TypeEmp {Name ="Logisticien", WebHired = 0},
                };
                context.AddRange(typeEmps);




                context.SaveChanges();
            }
        }
    }
}