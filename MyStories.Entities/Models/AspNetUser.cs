using Repository.Pattern.Ef6;
using System;
using System.Collections.Generic;

namespace MyStories.Entities.Models
{
    public partial class AspNetUser : Entity
    {
        public AspNetUser()
        {
            this.AspNetUserClaims = new List<AspNetUserClaim>();
            this.AspNetUserLogins = new List<AspNetUserLogin>();
            this.AspNetRoles = new List<AspNetRole>();
        }

        public string Id { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string SecurityStamp { get; set; }
        public string Discriminator { get; set; }
        public string LastName { get; set; }
        public virtual ICollection<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual ICollection<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual ICollection<AspNetRole> AspNetRoles { get; set; }
    }
}
