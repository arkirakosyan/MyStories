using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyStories.Entities.Assitants
{
    public class JqxGridSentData
    {
        public int totalrows { get; set; }
        public string searchKey { get; set; }
        public bool showAllStories { get; set; }

        public string searchKeyLower {
            get { return string.IsNullOrWhiteSpace(searchKey) ? null : searchKey.ToLowerInvariant(); }
        }
        /// <summary>
        /// the sort column's datafield.
        /// </summary>
        public string sortdatafield { get; set; }
        /// <summary>
        /// the sort order - 'asc', 'desc' or ''
        /// </summary>
        public string sortorder { get; set; }
        /// <summary>
        /// the current page's number when the paging feature is enabled.
        /// </summary>
        public int pagenum { get; set; }

        /// <summary>
        /// the page's size which represents the number of rows displayed in the view.
        /// </summary>
        public int pagesize { get; set; }
        /// <summary>
        /// the index in the view's first visible record.
        /// </summary>
        public int recordstartindex { get; set; }
        /// <summary>
        /// the index in the view's last visible record
        /// </summary>
        public int recordendindex { get; set; }
        /// <summary>
        /// the number of groups in the Grid
        /// </summary>
        public int groupscount { get; set; }
        /// <summary>
        /// the group's name. The group's name for the first group is 'group0', for the second group is 'group1' and so on.
        /// </summary>
        public string group { get; set; }
        /// <summary>
        /// the number of filters applied to the Grid
        /// </summary>
        public int filtercount { get; set; }
        /// <summary>
        /// the filter's value. The filtervalue name for the first filter is "filtervalue0", for the second filter is "filtervalue1" and so on.
        /// </summary>
        public string filtervalue { get; set; }
        /// <summary>
        ///the filter's condition. The condition can be any of these: "CONTAINS", "DOES_NOT_CONTAIN", "EQUAL", "EQUAL_CASE_SENSITIVE", NOT_EQUAL","GREATER_THAN", "GREATER_THAN_OR_EQUAL", "LESS_THAN", "LESS_THAN_OR_EQUAL", "STARTS_WITH", "STARTS_WITH_CASE_SENSITIVE", "ENDS_WITH", "ENDS_WITH_CASE_SENSITIVE", "NULL", "NOT_NULL", "EMPTY", "NOT_EMPTY"
        /// </summary>
        public string filtercondition { get; set; }
        /// <summary>
        /// the filter column's datafield
        /// </summary>
        public string filterdatafield { get; set; }
        /// <summary>
        ///  the filter's operator - 0 for "AND" and 1 for "OR"
        /// </summary>
        public int filteroperator { get; set; }
    }
}