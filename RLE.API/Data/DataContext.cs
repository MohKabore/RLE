using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RLE.API.Models;

namespace RLE.API.Data {
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, 
    UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>> {
        public DataContext (DbContextOptions<DataContext> options) : base (options) { }

        public DbSet<Photo> Photos { get; set; }
        public  DbSet<Account> Accounts { get; set; }
        public  DbSet<AccountType> AccountTypes { get; set; }
        public  DbSet<Address> Addresses { get; set; }
        public  DbSet<Bank> Banks { get; set; }
        public  DbSet<BankAccount> BankAccounts { get; set; }
        public  DbSet<Capability> Capabilities { get; set; }
        public  DbSet<CashDesk> CashDesks { get; set; }
        public  DbSet<CashDeskCheque> CashDeskCheques { get; set; }
        public  DbSet<CashIn> CashIns { get; set; }
        public  DbSet<CashInType> CashInTypes { get; set; }
        public  DbSet<Category> Categores { get; set; }
        public  DbSet<Cheque> Cheques { get; set; }
        public  DbSet<Circuit> Circuits { get; set; }
        public  DbSet<City> Cities { get; set; }
        public  DbSet<CityCircuit> CityCircuits { get; set; }
        public  DbSet<CityType> CityTypes { get; set; }
        public  DbSet<CityZone> CityZones { get; set; }
        public  DbSet<Country> Countres { get; set; }
        public  DbSet<Department> Departments { get; set; }
        public  DbSet<Diploma> Diplomas { get; set; }
        public  DbSet<District> Districts { get; set; }
        public  DbSet<Ecdeployment> Ecdeployments { get; set; }
        public  DbSet<EducationalTrack> EducationalTracks { get; set; }
        public  DbSet<EmpHistory> EmpHistories{ get; set; }
        // public  DbSet<Employee> Employee { get; set; }
        public  DbSet<EmployeeClass> EmployeeClasses { get; set; }
        public  DbSet<EnrolmentCenter> EnrolmentCenters { get; set; }
        public  DbSet<Expense> Expenses { get; set; }
        public  DbSet<Export> Exports { get; set; }
        public  DbSet<Failure> Failures { get; set; }
        public  DbSet<FailureGroup> FailureGroups { get; set; }
        public  DbSet<FailureList> FailureLists { get; set; }
        public  DbSet<FinOpHistory> FinOpHistories { get; set; }
        public  DbSet<FinOpType> FinOpTypes { get; set; }
        public  DbSet<FinancialOperation> FinancialOperations { get; set; }
        public  DbSet<FinancialOperationCheque> FinancialOperationCheques { get; set; }
        public  DbSet<Fuel> Fuels { get; set; }
        public  DbSet<InventOp> InventOps { get; set; }
        public  DbSet<InventOpType> InventOpTypes { get; set; }
        public  DbSet<Invoice> Invoices { get; set; }
        public  DbSet<InvoiceType> InvoiceTypes { get; set; }
        public  DbSet<Maintenance> Maintenances { get; set; }
        public  DbSet<MaritalStatus> MaritalStatus { get; set; }
        public  DbSet<MenuItem> MenuItems { get; set; }
        public  DbSet<Municipality> Municipalities { get; set; }
        public  DbSet<PaymentTerm> PaymentTerms{ get; set; }
        public  DbSet<PaymentType> PaymentTypes { get; set; }
        public  DbSet<PoshipmentMethod> PoshipmentMethods { get; set; }
        public  DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public  DbSet<Region> Regions { get; set; }
        public  DbSet<Repair> Repairs { get; set; }
        public  DbSet<RepairAction> RepairActions { get; set; }
        public  DbSet<RepairTablet> RepairTablets { get; set; }
        public  DbSet<RepairType> RepairTypes { get; set; }
        //  public  DbSet<Role> Roles { get; set; }
        public  DbSet<RoleCapability> RoleCapabilities { get; set; }
        public  DbSet<RouteType> RouteTypes { get; set; }
        public  DbSet<SaleOrder> SaleOrders { get; set; }
        public  DbSet<Sdcard> Sdcards { get; set; }
        public  DbSet<SdcardTablet> SdcardTablets { get; set; }
        public  DbSet<SopaymentTerm> SopaymentTerms { get; set; }
        public  DbSet<SoshipmentMethod> SoshipmentMethods { get; set; }
        public  DbSet<StateProvince> StateProvinces { get; set; }
        public  DbSet<StockMvt> StockMvts { get; set; }
        public  DbSet<StockMvtInventOp> StockMvtInventOps { get; set; }
        public  DbSet<Store> Stores { get; set; }
        public  DbSet<StudyLevel> StudyLevels { get; set; }
        public  DbSet<Supplier> Suppliers { get; set; }
        public  DbSet<Tablet> Tablets { get; set; }
        public  DbSet<Tax> Taxes { get; set; }
        public  DbSet<TrainerClass> TrainerClasses { get; set; }
        public  DbSet<Training> Trainings { get; set; }
        public  DbSet<TrainingClass> TrainingClasses { get; set; }
        public  DbSet<TypeEmp> TypeEmps { get; set; }
        public  DbSet<Vehicle> Vehicles { get; set; }
        public  DbSet<VehicleFuel> VehicleFuels { get; set; }
        public  DbSet<VehicleType> VehicleTypes { get; set; }
        public  DbSet<Zone> Zones { get; set; }
        public  DbSet<UserHistory> UserHistories { get; set; } 
        public  DbSet<UserHistoryType> UserHistoryTypes { get; set; }
        public  DbSet<Quota> Quotas { get; set; }
        public  DbSet<StoreType> StoreTypes { get; set; }
        public  DbSet<Email> Emails { get; set; }
        public  DbSet<Product>  Products { get; set; }
        public  DbSet<RetrofitInventOp>  RetrofitInventOps { get; set; }
        public  DbSet<RetrofitStore>  RetrofitStores { get; set; }
        public  DbSet<RetrofitStoreProduct>  RetrofitStoreProducts { get; set; }
        public  DbSet<RetrofitStockMvt>  RetrofitStockMvts { get; set; }
        public  DbSet<RetrofitStockMvtInventOp>  RetrofitStockMvtInventOps { get; set; }
        public  DbSet<TabletType>  TabletTypes { get; set; }
        public  DbSet<EcData>  EcData { get; set; }




        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            builder.Entity<UserRole> (userRole => {
                userRole.HasKey (ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne (ur => ur.Role)
                    .WithMany (r => r.UserRoles)
                    .HasForeignKey (ur => ur.RoleId)
                    .IsRequired ();

                userRole.HasOne (ur => ur.User)
                    .WithMany (r => r.UserRoles)
                    .HasForeignKey (ur => ur.UserId)
                    .IsRequired ();
            });
        }
    }
}