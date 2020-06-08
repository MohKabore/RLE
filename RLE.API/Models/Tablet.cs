
namespace RLE.API.Models
{
    public partial class Tablet
    {
    
        public int Id { get; set; }
        public int? StoreId { get; set; }
        public string Imei { get; set; }
        public byte Status { get; set; }
        public bool Active { get; set; }
        public bool Type { get; set; }
        public  Store Store { get; set; }
        
        public int TabletTypeId { get; set; }
        public TabletType TabletType { get; set; }
        // public TabletType TabletType { get; set; }
        // public  ICollection<User> Employee { get; set; }
        // public  ICollection<Failure> FailureTablet { get; set; }
        // public  ICollection<Failure> FailureTabletEx { get; set; }
        // public  ICollection<InventOp> InventOpTablet { get; set; }
        // public  ICollection<InventOp> InventOpTabletEx { get; set; }
        // public  ICollection<Maintenance> Maintenance { get; set; }
        // public  ICollection<RepairTablet> RepairTablet { get; set; }
        // public  ICollection<SdcardTablet> SdcardTablet { get; set; }
    }
}
