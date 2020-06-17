using System;
using System.Collections.Generic;
using System.Linq;
using RLE.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace RLE.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {

            
            // var users = context.Users.Where(r => r.TypeEmpId == 3);
            // int step = 0;
            // var lst2 = new List<int>();
            // foreach (var usr in users)
            // {
            //     var doublons = users.Where(r => r.TypeEmpId == usr.TypeEmpId && r.LastName == usr.LastName &&
            //     r.PhoneNumber == usr.PhoneNumber && r.Id != usr.Id);
            //     if (doublons.Count() > 0)
            //         lst2.AddRange(doublons.Select(a => a.Id));
            // }

            // try
            // {
            //     foreach (var userid in lst2.Distinct())
            //     {
            //         var userh = context.UserHistories.Where(a => a.UserId == userid);
            //         context.RemoveRange(userh);
            //         var user = context.Users.FirstOrDefault(a => a.Id == userid);
            //         context.Remove(user);
            //     }
            //     context.SaveChanges();
            // }
            // catch (System.Exception)
            // {

            //     throw;
            // }


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



                var quotas = new List<Quota> {
                    new Quota {Name = "Inscription", Percentage = 3},
                    new Quota {Name = "Pré-selection", Percentage = 20},
                    new Quota {Name = "Formation", Percentage = 15},
                    new Quota {Name = "Selection", Percentage = 10},
                };
                context.AddRange(quotas);

                var storetypes = new List<StoreType> {
                    new StoreType {Name = "Magasin"},
                    new StoreType {Name = "Client"},
                    new StoreType {Name = "Personnel"}
                };
                context.AddRange(storetypes);

                var stores = new List<Store> {
                new Store {Name = "MAG AT", StoreTypeId=1},
                new Store {Name = "MAG MORPHO", StoreTypeId=1},
                new Store {Name = "MAG CEI", StoreTypeId=2},
                };

                context.AddRange(stores);

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


                var educTracks = new List<EducationalTrack>() {
                    new EducationalTrack{Name = "AGRICULTURE"},
                    new EducationalTrack{Name = "ASSSURANCE"},
                    new EducationalTrack{Name = "BANQUE"},
                    new EducationalTrack{Name = "GESTION COMMERCIALE"},
                    new EducationalTrack{Name = "INFORMATIQUE"},
                    new EducationalTrack{Name = "MECANIQUE"},
                    new EducationalTrack{Name = "SCIENCES JURIDIQUES"},
                    new EducationalTrack{Name = "SOCIOLOGIE"},
                    new EducationalTrack{Name = "PSYCHOLOGIE"},
                    new EducationalTrack{Name = "PHILOSOPHIE"},
                    new EducationalTrack{Name = "MATHEMATIQUES"},
                    new EducationalTrack{Name = "SCIENCES ECONOMOMIQUES"},
                    new EducationalTrack{Name = "RESSOURCES HUMAINES"},
                    new EducationalTrack{Name = "COMMUNICATION"},
                    new EducationalTrack{Name = "MARKETING"},
                    new EducationalTrack{Name = "SCIENCES MEDICALES"},
                    new EducationalTrack{Name = "AUTRES..."},

                };
                context.AddRange(educTracks);


                var failueresGroupes = new List<FailureGroup>() {
                    new FailureGroup{Name="Problème Fonctionnel"},
                    new FailureGroup{Name="Problème Logiciel"},
                    new FailureGroup{Name="Problème Matériel"}
                };
                context.AddRange(failueresGroupes);

                var failuresLitst = new List<FailureList>() {
                    new FailureList{FailureGroupId =3 , Name ="Ecran tactile HS"},
                    new FailureList{FailureGroupId =3 , Name ="prob. de démarrage"},
                    new FailureList{FailureGroupId =3 , Name ="prob. lecture CNI"},
                    new FailureList{FailureGroupId =3 , Name ="prob. lecture carte SD"},
                    new FailureList{FailureGroupId =3 , Name ="prob. photo / QR code"},
                    new FailureList{FailureGroupId =3 , Name ="Batt. tablette/externe vide, NOK"},
                    new FailureList{FailureGroupId =3 , Name ="tablette cassée"},
                    new FailureList{FailureGroupId =3 , Name ="prob affichage écran"},
                    new FailureList{FailureGroupId =3 , Name ="capteur empreinte ne s'allume pas"},
                    new FailureList{FailureGroupId =2 , Name ="lecture NOK QR code au démarrage"},
                    new FailureList{FailureGroupId =2 , Name ="Ecran anormal au démarrage"},
                    new FailureList{FailureGroupId =2 , Name ="capteur empreinte ne répond pas"},
                    new FailureList{FailureGroupId =2 , Name ="une application ne démarre pas"},
                    new FailureList{FailureGroupId =2 , Name ="problème lecture CNI"},
                    new FailureList{FailureGroupId =2 , Name ="prob. de lecture CE"},
                    new FailureList{FailureGroupId =1 , Name ="mauvaise utilisation tablette"},
                    new FailureList{FailureGroupId =1 , Name ="concerne pas utilisation tablette"},
                    new FailureList{FailureGroupId =1 , Name ="agent CEI n'a pas de tablette"},
                    new FailureList{FailureGroupId =1 , Name ="problème avec la carte SD"},
                    new FailureList{FailureGroupId =1 , Name ="prob. de mot de passe"}
                };
                context.AddRange(failuresLitst);


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
                    new UserHistoryType{Name="Rétirer utilisateur a une salle de formation"},// position 12
                    new UserHistoryType{Name="Cloturer a une salle de formation"},// position 13
                    new UserHistoryType{Name="Selectionnner Utilisateur"},// position 14
                    new UserHistoryType{Name="DeSelectionner itulisateur"},// position 15
                    new UserHistoryType{Name="Reserver Utilisateur"},// position 16
                    new UserHistoryType{Name="Annuler reservation Utilisateur"}// position 17
                };
                context.AddRange(uht);

                var inventOptypes = new List<InventOpType>() {
                    new InventOpType{Name ="Entrée Stock"},
                    new InventOpType{Name ="Transfert Stock"},
                    new InventOpType{Name ="Affectation Tablette"},
                    new InventOpType{Name ="Echange Tablette"},
                    new InventOpType{Name ="Panne"},
                    new InventOpType{Name ="Export"},
                    new InventOpType{Name ="En Réparation"},
                    new InventOpType{Name ="Retour Réparation"},
                    new InventOpType{Name ="Maintenance"}
                };
                context.AddRange(inventOptypes);


                var maritalsStatus = new List<MaritalStatus>() {
                    new MaritalStatus{Name="Célbataire"},
                    new MaritalStatus{Name="Marié(e)"},
                    new MaritalStatus{Name="Veuf/veuve"},
                    new MaritalStatus{Name="Divorcé(e)"}
                };
                context.AddRange(maritalsStatus);


                var repairActions = new List<RepairAction>() {
                    new RepairAction {Name ="Redémarrage"},
                    new RepairAction {Name ="Hard Reboot"},
                    new RepairAction {Name ="Nettoyage lentille"},
                    new RepairAction {Name ="Nettoyage capteur empreinte"}
                };
                context.AddRange(repairActions);

                var studyLevels = new List<StudyLevel>() {
                    new StudyLevel {Name = "BAC"},
                    new StudyLevel {Name = "BAC+2"},
                    new StudyLevel {Name = "LICENCE"},
                    new StudyLevel {Name = "MASTER"},
                    new StudyLevel {Name = "DOCTORAT"},
                    new StudyLevel {Name = "BEPC"},
                    new StudyLevel {Name = "NIV. TERMINALE"},
                };
                context.AddRange(studyLevels);




                context.SaveChanges();
            }
        }
    }
}