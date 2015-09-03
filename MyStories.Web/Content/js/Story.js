
var Story = function () {
    dialog = '';
    viewDialog = '';
   
    init = function () {

        initControls();
        initStoryGrid('');
    }

    initControls = function () {

        $('input[type="text"], #txtDesc').each(function () {
            $(this).jqxInput({ theme: 'Story', width: 300 });
        });
      //  $('#showAllStories').jqxCheckBox({ theme: 'Story' });
        $('#txtContent').jqxEditor({ theme: 'Story', height: 300 });
        $('#btnNewStory').jqxButton({ theme: 'Story' });
       
        initGroupsList();
    }
    initGroupsList = function()
    {
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'Name' },
                { name: 'Id' }
            ],
            id: 'Value',
            url: GetAllGroupsURL
        };
        // create a new instance of the jqx.dataAdapter.
        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#groupsList").jqxListBox({ theme: 'Story',checkboxes: true, source: dataAdapter, displayMember: "Name", valueMember: "Id", height: 250, width: 280 });
    }
    resetForm = function () {
        $('#hdnStoryID').val('0');
        $('#txtTitle').val('');
        $('#txtDesc').val('');
        $('#txtContent').val('');
        $('#dtPostedOn').jqxDateTimeInput('setDate', new Date());
        $("#groupsList").jqxListBox('uncheckAll');
    }
    resetViewForm = function () {
        $('#lblTitle').text('');
        $('#lblDesc').text('');
        $('#lblContent').text('');
        $('#lblPostedOn').text('');
        $("#lblGroupsList").text('');
    }
    loadForm = function (datarow) {
        $('#hdnStoryID').val(datarow.Id);
        $('#txtTitle').val(datarow.Title);
        $('#txtDesc').val(datarow.Description);
        $('#txtContent').val(datarow.Content);
        $("#dtPostedOn").jqxDateTimeInput('setDate', jsonDateToString(datarow.PostedOn));
        $(datarow.Groups).each(function () {
            $("#groupsList").jqxListBox('checkItem', this.Id);
        });
    }
    loadViewModal = function (storyID) {
        initStoryViewDialog();
        resetViewForm();
        $.ajax({
            type: 'POST',
            url: GetStoryURL,
            dataType: 'json',
            cache: false,
            data: { id: storyID },
            success: function (data, textStatus, jqXHR) {
                if (data) {
                    $('#ViewStoryModalLabel').html('<i class="glyphicon glyphicon-file"></i> ' + data.Title + ' - ' + jsonDateToString(data.PostedOn));                    
                    $('#lblDesc').text(data.Description);
                    $('#lblContent').html(data.Content);
                    var groups = '';
                    $(data.Groups).each(function () {
                        groups += this.Name + ', ';
                    });
                    groups = groups.substr(0, groups.lastIndexOf(','));
                    $('#lblGroupsList').text(groups);

                    setTimeout(function () {
                        Story.viewDialog.dialog('open');
                        Story.viewDialog.dialog({
                            position: { my: "center", at: "center", of: window }
                        });
                    }, 100);
                }
                else {
                    ShowErrorMSG(data.Message, '500px');
                }
            }
        });
    }
    initStoryDialog = function () {
        $("#dtPostedOn").jqxDateTimeInput({ width: 100, height: 25, formatString: 'MM/dd/yyyy', theme: 'Story' });
        Story.dialog = initDialog('newStoryModal', null, 'StoryModalLabel', 'btnCloseStoryModal', 'center', 'center');
        var wWidth = $(window).width();
        var wHeight = $(window).height();
        Story.dialog.dialog("option", "width", wWidth);
        Story.dialog.dialog("option", "height", wHeight);
    }
    initStoryViewDialog = function () {
        Story.viewDialog = initDialog('ViewStoryModal', null, 'ViewStoryModalLabel', 'btnCloseViewStoryModal', 'center', 'center');
        var wWidth = $(window).width();
        var wHeight = $(window).height();
        Story.viewDialog.dialog("option", "width", wWidth);
        Story.viewDialog.dialog("option", "height", wHeight);
    }
    initStoryGrid = function () {
        var source =
                    {
                        datatype: "json",
                        datafields: [
                             { name: 'Id', type: 'int' },
                             { name: 'Title', type: 'string' },
                             { name: 'Description', type: 'string' },
                             { name: 'Content', type: 'string' },
                             { name: 'PostedOn', type: 'string' },
                             { name: 'UserId', type: 'string' }
                        ],
                        id: 'Id',
                        url: GetMyStoriesURL,
                        sortcolumn: 'Title',
                        sortdirection: 'asc',
                        addrow: function (rowid, rowdata, position, commit) {
                            commit(true);
                        },
                        deleterow: function (rowid, commit) {
                            commit(true);
                        },
                        updaterow: function (rowid, rowdata, commit) {
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
                data.showAllStories = $("#showAllStories").prop("checked");
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
                editable: false,
                columnsresize: true,
                altrows: false,
                pageable: true,
                autoheight: true,
                autoshowloadelement: true,
                virtualmode: true,
                rendergridrows: function () {
                    return dataAdapter.records;
                },
                rendertoolbar: function (toolbar) {
                    $('#goBtn').on('click', function () {
                        $("#grid").jqxGrid('updatebounddata');
                        $('#grid').jqxGrid('gotopage', 0);
                    });

                    $('#searchField').on('keydown', function (event) {
                        var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
                        if (keycode == 13) {
                            $('#goBtn').click();
                            return false;
                        } else {
                            return true;
                        }
                    });
                    $('#showAllStories').on('change', function (event) {
                        $('#goBtn').click();
                    });
                },
                columns: [
                    { text: "Id", datafield: "Id", hidden: true },
                    { text: "UserId", datafield: "UserId", hidden: true },
                    {
                        text: "Title", datafield: "Title", rendered: tooltiprenderer,
                        cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                            return "<div style='margin-left:2px;margin-top:4px;'><a href='#' onclick='loadViewModal(" + rowdata.Id + ")'>" + value + "</a></div>";
                        }
                    },
                    {
                        text: "Posted On", datafield: "PostedOn", width: '130px', rendered: tooltiprenderer,
                        cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
                            return "<div style='margin-left:5px;margin-top:4px;'>" + jsonDateToString(value) + "</div>";
                        }
                    },
                    { text: "Description", datafield: "Description", rendered: tooltiprenderer },
                    
                    { text: '', datafield: 'Actions', width: '60px', cellsrenderer: actionButtonsRenderer, sortable: false, rendered: tooltiprenderer }
                ]
            });
        $('#grid').on('rowdoubleclick', function (event) {
            editStoryClick(event.args.rowindex);
        });
    }
    actionButtonsRenderer = function (row, datafield, value) {
        var datarow = $("#grid").jqxGrid('getrowdata', row);
        var actionButtons = '';
        if (datarow.UserId == loggedUserId) {
            var actionButtons = '<div class="gridActionButtons">' +
                '<button type="button" onclick="Story.editStoryClick(' + row + ')" class="btn btn-default btn-xs m-r-2" title="Edit">' +
                '<span class="glyphicon glyphicon-pencil"></span>' +
                '</button>';
            actionButtons += '<button type="button" onclick="Story.deleteStoryClick(' + datarow.Id + ')" class="btn btn-default btn-xs" title="Delete">' +
                '<span class="glyphicon glyphicon-remove"></span>' +
                '</button>';
            actionButtons += '</div>';
        }
        return actionButtons;
    }
    addStoryClick = function () {

        initStoryDialog();;
        $('#btnDeleteStory').hide();
        resetForm();
        $('#StoryModalLabel').html('<i class="glyphicon glyphicon-file"></i> New Story');
        setTimeout(function () {
            Story.dialog.dialog('open');
            Story.dialog.dialog({
                position: { my: "center", at: "center", of: window }
            });
        }, 100);
    }
    editStoryClick = function (rowIndex) {
        initStoryDialog();
        $('#StoryModalLabel').html('<i class="glyphicon glyphicon-file"></i> Edit Story');
        resetForm();
        var datarow = $("#grid").jqxGrid('getrowdata', rowIndex);
        $.ajax({
            type: 'POST',
            url: GetStoryURL,
            dataType: 'json',
            cache: false,
            data: { id: datarow.Id },
            success: function (data, textStatus, jqXHR) {
                if (data) {
                    loadForm(data);
                    setTimeout(function () {
                        Story.dialog.dialog('open');
                        Story.dialog.dialog({
                            position: { my: "center", at: "center", of: window }
                        });
                    }, 100);
                }
                else {
                    ShowErrorMSG(data.Message, '500px');
                }
            }
        });
    }
    saveStory = function () {
        if ($('#storyForm').parsley().validate()) {
        var groups =new Array();
        var checkedGroups = $("#groupsList").jqxListBox('getCheckedItems');
        var groups = jQuery.map(checkedGroups, function (n, i) {
            return new Object({ 'Id': parseInt(n.value), 'Name': n.label });
        });
            waitingDialog();
            var fields = new Object({
                Id: $('#hdnStoryID').val(),
                Title: $('#txtTitle').val(),
                Description: $('#txtDesc').val(),
                Content: $('#txtContent').val(),
                PostedOn: $('#dtPostedOn').jqxDateTimeInput('getText'),
                Groups: groups
            });
            $.ajax({
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                url: SaveStoryURL,
                data: JSON.stringify(fields),
                cache: false,
                success: function (data, textStatus, jqXHR) {
                    if (!data.Successed) {
                        ShowErrorMSG(data.Message, '500px');
                    }
                    else {
                        $("#grid").jqxGrid('updatebounddata');
                        ShowSuccessMSG(data.Message, '500px');
                        Story.dialog.dialog('close');
                    }
                },
                complete: closeWaitingDialog
            });
       }
    }
    deleteStoryClick = function (id) {
        fnConfirmDialog("Are you sure you want to delete story?", deleteStoryCall,id);
    }
    deleteStoryCall = function (storyId) {
        $.ajax({
            type: 'POST',
            url: DeleteStoryURL,
            dataType: 'json',
            cache: false,
            data: { id: storyId ? storyId : $('#hdnStoryID').val() },
            success: function (data, textStatus, jqXHR) {
                if (data.Successed) {
                    resetForm();

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
        resetForm: resetForm,
        addStoryClick: addStoryClick,
        saveStory: saveStory,
        deleteStoryClick: deleteStoryClick,
        editStoryClick: editStoryClick,
        dialog: dialog,
        viewDialog: viewDialog
    };
}();