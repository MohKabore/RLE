using System;

namespace RLE.API.Models
{
    public class UserHistory
    {
        public UserHistory()
        {
            InsertDate = DateTime.Now;
        }
        public int Id { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public int InsertUserId { get; set; }
        public User InsertUser { get; set; }
        public int UserHistoryTypeId { get; set; }
        public UserHistoryType UserHistoryType { get; set; }
        public int? TrainingId { get; set; }
        public Training Training { get; set; }

        public int? TrainingClassId { get; set; }
        public TrainingClass TrainingClass { get; set; }

        public DateTime InsertDate { get; set; }
    }
}