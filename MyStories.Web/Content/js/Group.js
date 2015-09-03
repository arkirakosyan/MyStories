var Group = function () {
    init = function () {

        $('#btnNewGroup').jqxButton({ theme: 'Story' });
        initGroupGrid('');
    }
    initGroupGrid = function () {
        var source =
                    {
                        datatype: "json",
                        datafields: [
                             { name: 'Id', type: 'int' },
                             { name: 'Name', type: 'string' },
                             { name: 'Description', type: 'string' },
                             { name: 'NbrOfStories', type: 'int' },
                             { name: 'NbrOfMembers', type: 'int' }
                        ],
                        id: 'Id',
                        url: GetGroupsURL,
                        sortcolumn: 'Name',
                        sortdirection: 'asc',
                        addrow: function (rowid, rowdata, position, commit) {
                            commit(true);
                        },
                        deleterow: function (rowid, commit) {
                            commit(true);
                        },
                        updaterow: function (rowid, rowdata, commit) {
                            debugger;
                            waitingDialog();
                            var fields = new Object({
                                Id: rowdata.Id,
                                Name: rowdata.Name,
                                Description: rowdata.Description
                            });
                            $.ajax({
                                type: 'POST',
                                dataType: 'json',
                                contentType: 'application/json',
                                url: SaveGroupURL,
                                data: JSON.stringify(fields),
                                cache: false,
                                success: function (data, textStatus, jqXHR) {
                                    if (!data.Successed) {
                                        ShowErrorMSG(data.Message, '500px');
                                    }
                                    else {
                                        rowdata.Id = data.ReturnValue;
                                        $("#grid").jqxGrid('updatebounddata');
                                        ShowSuccessMSG(data.Message, '500px');
                                    }
                                },
                                complete: closeWaitingDialog
                            });
                            commit(true);
                        },
                        pager: function (pagenum, pagesize, oldpagenum) {
                            // callback called when a page or page size is changed.
                            $("#grid").jqxGrid('updatebounddata');
                        },
                        sort: function (pagenum, pagesize, oldpagenum) {
                            // callback called when a page or page size is changed.
                            $("#grid").jqxGrid('updatebounddata');
                        },
                        filter: function () {
                            // update the grid and send a request to the server.
                            $("#grid").jqxGrid('updatebounddata');
                        },
                        beforeprocessing: function (data) {
                            source.totalrecords = data.TotalRows;
                        }
                    };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            formatData: function (data) {
                data.searchKey = $("#searchField").val();
                return data;
            },
        });

        // initialize jqxGrid
        $("#grid").jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            selectionmode: 'singlerow',
            theme: 'Story',
            sortable: true,
            editable: true,
            editmode: 'selectedrow',
            columnsresize: true,
            altrows: true,
            pageable: false,
            autoheight: true,
            autoshowloadelement: true,
            virtualmode: true,
            rendergridrows: function() {
                return dataAdapter.records;
            },
            columns: [
            { text: "Id", datafield: "Id", hidden: true },
            { text: "Name", datafield: "Name", rendered: tooltiprenderer },
            { text: "Description", datafield: "Description", rendered: tooltiprenderer },
            { text: "NbrOfStories", datafield: "NbrOfStories", editable: false, rendered: tooltiprenderer },
            { text: "NbrOfMembers", datafield: "NbrOfMembers", editable: false, rendered: tooltiprenderer },
                    { text: '', datafield: 'Actions', width: '60px', cellsrenderer: actionButtonsRenderer, editable: false, sortable: false, rendered: tooltiprenderer }
                ]
            });
    }
    actionButtonsRenderer = function (row, datafield, value) {
        var datarow = $("#grid").jqxGrid('getrowdata', row);
        var actionButtons = '<div class="gridActionButtons">' +
                                '<button type="button" onclick="Group.deleteGroupClick(' + datarow.Id + ')" class="btn btn-default btn-xs" title="Delete">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                            '</button></div>';
        return actionButtons;
    }
    addGroupClick = function () {
        var rowscount = $("#grid").jqxGrid('getdatainformation').rowscount;
        var row = new Object({
            Id: -1 * rowscount,
            Name: '',
            Description: ''
        });
        var commit = $("#grid").jqxGrid('addrow', null, row);
    }
    deleteGroupClick = function (id) {
        fnConfirmDialog("Are you sure you want to delete the group?", deleteGroupCall,id);
    }
    deleteGroupCall = function (groupId) {
        $.ajax({
            type: 'POST',
            url: DeleteGroupURL,
            dataType: 'json',
            cache: false,
            data: { id: groupId ? groupId : $('#hdnGroupID').val() },
            success: function (data, textStatus, jqXHR) {
                if (data.Successed) {
                    $("#grid").jqxGrid('updatebounddata');
                    ShowSuccessMSG(data.Message, '500px');
                }
                else {
                    ShowErrorMSG(data.Message, '500px');
                }
            }
        });
    }
    return {
        init: init,
        addGroupClick: addGroupClick,
        deleteGroupClick: deleteGroupClick
    };
}();