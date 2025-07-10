using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models{
    [Table("Orders")]
    public class Order{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId {get; set;}

        [Required]
        [ForeignKey("User")]
        [JsonIgnore]
        public int UserId {get; set;}

        [Required]
        public DateTime OrderDate {get; set;} = DateTime.Now;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount {get; set;}

        public User? User {get; set;}
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}