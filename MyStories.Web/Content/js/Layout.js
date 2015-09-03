$.fn.modal.Constructor.prototype.enforceFocus = function () { };
$.fn.center = function () {
    this.css('margin', 'auto');
    if ($(this).parent().height() > this.height())
        this.css("top", ($(this).parent().height() - this.height()) / 2);
    return this;
}
$.fn.style = function (styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
        return this;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
        if (typeof value != 'undefined') {
            // Set style property
            priority = typeof priority != 'undefined' ? priority : '';
            style.setProperty(styleName, value, priority);
            return this;
        } else {
            // Get style property
            return style.getPropertyValue(styleName);
        }
    } else {
        // Get CSSStyleDeclaration
        return style;
    }
}
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function (title) {
        var $titleMSG = '';// '<div class="msgs-hide alert modalMSGAlert" onclick="$(this).removeClass(\'msgs-show\').addClass(\'msgs-hide\')"><strong id="modalMSGTitle"></strong><span id="modalMSG"></span></div>'
        var $title = this.options.title || ''
        if (("title_html" in this.options) && this.options.title_html == true)
            title.html($title + $titleMSG);
        else title.text($title);
    }
}));

var tooltiprenderer = function (element) {
    $(element).jqxTooltip({ position: 'mouse', content: $(element).text() });
}
var messageDialog;
function fnConfirmDialog(message, callback, param) {
    var html = '<div class="modal-footer">' +
                    '<button class="btn btn-default" onclick="dialogClose();">Cancel</button>' +
                    '<button class="btn btn-primary" id="btnConfirm">OK</button>' +
                '</div>';

    messageDialog = $("<div id='dlgConfirm'></div>").html('<i class="fa fa-lg fa-fw fa-warning"></i><span>' + message + '</span>' + html);


    messageDialog.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width:'auto',
        title_html: true,
        show: { effect: 'fade', duration: 200 },
        hide: { effect: 'fade', duration: 200 },
        dialogClass: 'customDialog',
        open: function () {
            $('#btnConfirm').on('click', function () {
                callback(param);
                messageDialog.dialog('close');
            });
            $('.ui-dialog-titlebar-close').text('x');
        },
        close: function (event, ui) {
            $(this).dialog('destroy');
            $(this).detach();
            $(this).remove();
        }
    });

    messageDialog.dialog('open');
    $('.customDialog').prev('.ui-widget-overlay').style('z-index', '1060', 'important');
}
function fnConfirmDialogVV(message, callback, param) {
    var html = '<div class="modal-footer">' +
                    '<button class="btn btn-default" id="btnConfirm">Cancel</button>' +
                    '<button class="btn btn-primary" onclick="dialogClose();">OK</button>' +
                '</div>';

    messageDialog = $("<div id='dlgConfirm'></div>").html('<i class="fa fa-lg fa-fw fa-warning"></i><span>' + message + '</span>' + html);


    messageDialog.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 'auto',
        title_html: true,
        show: { effect: 'fade', duration: 200 },
        hide: { effect: 'fade', duration: 200 },
        dialogClass: 'customDialog',
        open: function () {
            $('#btnConfirm').on('click', function () {
                callback(param);
                messageDialog.dialog('close');
            });
            $('.ui-dialog-titlebar-close').text('x');
        },
        close: function (event, ui) {
            $(this).dialog('destroy');
            $(this).detach();
            $(this).remove();
        }
    });

    messageDialog.dialog('open');
    $('.customDialog').prev('.ui-widget-overlay').style('z-index', '1060', 'important');
}
function dialogClose() {
    messageDialog.dialog("close")
}
function fnAlertDialog(message) {
    var html = '<div class="modal-footer">' +
                    '<button class="btn btn-primary" onclick="dialogClose();">OK</button>' +
                '</div>';

    messageDialog = $("<div id='dlgConfirm'></div>").html('<i class="fa fa-lg fa-fw fa-warning"></i><span>' + message + '</span>' + html);

    messageDialog.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        title_html: true,
        show: { effect: 'fade', duration: 200 },
        hide: { effect: 'fade', duration: 200 },
        dialogClass: 'customDialog',
        open: function () {
            $('.ui-dialog-titlebar-close').text('x');
        }
    });

    messageDialog.dialog('open');
    $('.customDialog').prev('.ui-widget-overlay').style('z-index', '1060', 'important');
}
var ActionType = {
    Add: 0,
    Edit: 1,
    Delete: 2
};

var UserProfile;
var pleaseSelectMSG = "Please select...";
var currentAdapterLoadedrecordCount = 0;
function ShowSuccessMSG(successMSG, left) {
    $('#successAlert').removeClass('hide');
    $('#errorAlert').slideUp();

    $('#successMSG').text(successMSG);
    $('#successAlert').slideDown();
    if (successMSG == "No data has been updated.")
        $('#strSuccess').hide();
    else
        $('#strSuccess').show();
}
function ShowErrorMSG(errorMSG, left) {
    $('#errorAlert').removeClass('hide');
    $('#errorAlert').hide();

    $('#successAlert').slideUp();

    $('#errorMSG').text(errorMSG);
    $('#errorAlert').slideDown();
}
function initDialog(modalID, bodyID, labelID, closeButtonID, positionMy, positionAt, width) {
    var dialog = $('#' + modalID).dialog({
        autoOpen: false,
        resizable: true,
        width: width ? width : 'auto',
        maxHeight: $(window).height() - 20,
        show: { effect: 'fade', duration: 50 },
        hide: { effect: 'fade', duration: 200 },
        position: { my: positionMy, at: positionAt },
        title_html: true,
        title: '<h4 class="modal-title" id="' + labelID + '"></h4>',
        open: function () {
            //$('html').css('overflow', 'hidden');
            var modal = this;
            $('#' + closeButtonID).on('click', function () {
                $(modal).dialog("close");
            });
            $(this).parent().parent().append($('<div class="ui-widget-overlay ui-front"></div>'));
            //     $(this).parent().append($('<div class="ui-widget-overlay ui-front"></div>'));
            $('.ui-dialog-titlebar-close').text('x');
        },
        close: function () {
            $('.ui-widget-overlay.ui-front').first().remove();
            if (bodyID) {
                $('#' + bodyID).empty();
                $('#' + bodyID).css('visibility', 'hidden');
            }

            // $('html').css('overflow', 'auto');

            //if ($('#modalMaximize').attr('src').match(/minimize.gif$/)) {
            //    modalResize($(this).attr('id'));
            //}

            if ($('.modalMSGAlert').length > 0)
                $('.modalMSGAlert').removeClass('msgs-show').addClass('msgs-hide');

            $('form input').each(function () {
                $('form').jqxValidator('hideHint', '#' + $(this).attr('id'));
            });
        }
    });
    return dialog;
}

function GetJQXComboAdapter(url, filterId, addDefaultValue, currentValue) {
    var source =
               {
                   type: 'POST',
                   datatype: "json",
                   datafields: [
                       { name: 'Value' },
                       { name: 'Name' }
                   ],
                   url: url
               };
    var dataAdapter = new $.jqx.dataAdapter(source,
        {
            formatData: function (data) {
                if (filterId != undefined) {
                    data.filterId = filterId
                }
                if (currentValue != undefined) {
                    data.currentValue = currentValue
                }
                return data;
            },
            beforeLoadComplete: function (records) {
                if (addDefaultValue)
                    records.unshift(new Object({ Name: 'All', Value: '', uid: -1 }));
                currentAdapterLoadedrecordCount = records.length;
                return records;
            }
        });

    return dataAdapter;
}
function GetJQXComboAdapterRemote(url, combo) {
    var source =
               {
                   type: 'POST',
                   datatype: "json",
                   datafields: [
                       { name: 'Value' },
                       { name: 'Name' }
                   ],
                   url: url
               };
    var dataAdapter = new $.jqx.dataAdapter(source,
        {
            formatData: function (data) {
                var s = $(combo).jqxComboBox('searchString');
                if (s != undefined) {
                    data.filterId = s;
                }
                return data;
            },
            beforeLoadComplete: function (records) {
                currentAdapterLoadedrecordCount = records.length;
                return records;
            }
        });

    return dataAdapter;
}
Date.prototype.getDayName = function () {
    var d = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return d[this.getDay()];
}
Date.prototype.getDayNameShort = function () {
    var d = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return d[this.getDay()];
}
Date.prototype.getMonthName = function () {
    var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return m[this.getMonth()];
}
Date.prototype.toCustomString = function () {
    return String.format("{0}/{1}/{2}", this.getMonth() + 1, this.getDate(), this.getFullYear())
}
Date.prototype.toCustomTimeString = function (separator) {
    return String.format("{0}{1}{2}", this.getHours(), separator, this.getMinutes())
}
function jsonDateToString(jsonDate) {
    return new Date(parseInt(jsonDate.split('(')[1].split(')')[0])).toCustomString();
}
String.format = String.prototype.format = function () {
    var i = 0;
    var string = (typeof (this) == "function" && !(i++)) ? arguments[0] : this;

    for (; i < arguments.length; i++)
        string = string.replace(/\{\d+?\}/, arguments[i]);

    return string;
};
String.toBool = String.prototype.toBool = function () {
    if (this == "True" || this == "true" || this == "1") return true;
    if (this == "False" || this == "false" || this == "0") return false;
    return undefined;

};
function toBool(str) {
    if (str == "True" || str == "true" || str == "1") return true;
    if (str == "False" || str == "false" || str == "0") return false;
    return undefined;
}
function convertJsonDate(jsonDate) {
    var dateString = jsonDate.substr(6);
    var currentTime = new Date(parseInt(dateString));
    return currentTime;
}
function loadCombo(combo, values, texts, selectedItem) {
    combo.find('option').remove();
    for (var i = 0; i < values.length; i++) {
        combo.append($('<option>', { value: values[i], text: texts[i] }));
    }

    combo.val(selectedItem);
}


function ScrollToBottom() {
    $("html, body").animate({ scrollTop: $(document).height() }, "100");
}
var minimizedTop = 0;
var minimizedLeft = 0;
var minimizedWidth = 0;
var minimizedHeight = 0;
var minimizePath = '';
var maximizePath = '';

function modalResize(currentModal) {
    if ($('#modalMaximize').attr('src').match(/maximize.gif$/)) {
        minimizedWidth = $('.modal.in .modal-dialog').width();
        minimizedHeight = $('.modal.in .modal-content').height();
        $('#' + currentModal + ' .modal-dialog').css('width', '99%');
        $('#' + currentModal + ' .modal-dialog').css('height', '99%');
        $('#' + currentModal + ' .modal-content').css('height', '99%');
        minimizedTop = $('#' + currentModal + ' .modal-dialog').css('top');
        minimizedLeft = $('.modal.in .modal-dialog').css('left');
        $('#' + currentModal + ' .modal-dialog').css('top', '10px');
        $('#' + currentModal).css('top', '0px');
        $('#' + currentModal).css('left', '0px');
        $('#modalMaximize').attr('src', minimizePath);

    }
    else {
        $('#' + currentModal + ' .modal-dialog').css('width', minimizedWidth);
        $('#' + currentModal + ' .modal-dialog').css('height', minimizedHeight);
        $('#' + currentModal + ' .modal-content').css('height', minimizedHeight);
        $('#' + currentModal).css('top', '0px');
        $('#' + currentModal).css('left', '0px');
        $('#' + currentModal + ' .modal-content').css('background', 'white');
        $('#' + currentModal + ' .modal-header').css('background', 'white');
        $('#' + currentModal + ' .modal-content form').css('background', 'white');
        $('#' + currentModal + ' .modal-dialog').css('top', minimizedTop);
        $('#' + currentModal + ' .modal-dialog').css('left', minimizedLeft);
        $('#modalMaximize').attr('src', maximizePath);
    }
}
function showLoader(loaderImg) {
    if ($('#' + loaderImg).length > 0) {
        var t = $('#' + loaderImg).parent('form');
        if (t.length == 0)
            t = $('#' + loaderImg).parent();
        $('#' + loaderImg).css('display', 'block');
        $('#' + loaderImg).css('left', $(t).position().left + 600);
        $('#' + loaderImg).css('top', $(t).position().top + 150);
    }
}
function showLoaderReport(loaderImg) {
    if ($('#' + loaderImg).length > 0) {
        var t = $('#' + loaderImg).parent();
        $('#' + loaderImg).css('display', 'block');
        $('#' + loaderImg).css('left', $(t).position().left + $(window).width() / 2);
        $('#' + loaderImg).css('top',$(t).position().top + $(window).height() / 3);
    }
}
function hideLoader(loaderImg) {
    $('#' + loaderImg + ' ~ div').css('visibility', 'visible');
    $('#' + loaderImg).css('display', 'none');
}
function waitingDialog(waiting) {    
    //  $("#loadingScreen").html(waiting.message && '' != waiting.message ? waiting.message : 'Please wait...');
    var open=$('#loadingScreen').dialog('open'); 
    if (open != null)
        open.dialog('open');
    $('.loadingScreenWindow').prev('.ui-widget-overlay').style('z-index', '1060', 'important');
}
function closeWaitingDialog() {
        var close=$('#loadingScreen').dialog('close'); 
        if (close != null)
            close.dialog('close');
}
$(document).ready(function () {
    var sidebarCookie = readCookie("sidebarCookie");
    if (sidebarCookie) {
        var sidebarClass = 'page-sidebar-minified';
        var targetContainer = '#page-container';
        $(targetContainer).addClass(sidebarClass);
        if ($(targetContainer).hasClass('page-sidebar-fixed')) {
            $('#sidebar [data-scrollbar="true"]').slimScroll({ destroy: true });
            $('#sidebar [data-scrollbar="true"]').removeAttr('style');
        }
        // firefox bugfix
        $('#sidebar [data-scrollbar=true]').trigger('mouseover');
        $(window).trigger('resize');
    }
    // create the loading window and set autoOpen to false
    $("#loadingScreen").dialog({
        autoOpen: false,    // set this to false so we can manually open it
        dialogClass: "loadingScreenWindow",
        closeOnEscape: false,
        draggable: false,
        width: 32,
        minHeight: 32,
        modal: true,
        buttons: {},
        resizable: false,
        open: function () {
            // scrollbar fix for IE
            $('body').css('overflow', 'hidden');
        },
        close: function () {
            // reset overflow
            $('body').css('overflow', 'auto');

        }
    });
    // end of dialog
    $(document).keyup(function () {
        if (event.keyCode == 13 && $('#goBtn').length > 0) {
            $('#goBtn').click();
        }

        if (event.keyCode > 47 && event.keyCode < 91) {
            var a = $(".jqx-dropdownlist-state-focus");
            if ($(a).length > 0) {
                if (!$(a).jqxDropDownList('isOpened')) {
                    $(a).on('open', function (event) { $('#filterinnerListBox' + $(a).attr('id')).find('input').focus() });
                    $(a).jqxDropDownList('open');

                    // $(a).removeClass("jqx-dropdownlist-state-focus").addClass("jqx-dropdownlist-state-normal")
                }
            }
        }

    });
    $(document).click(function () {
        $('#successAlert').slideUp();
        $('#errorAlert').slideUp();
        if ($('.modalMSGAlert').length > 0)
            $('.modalMSGAlert').removeClass('msgs-show').addClass('msgs-hide');
    });
    $(document).on('ajaxSend', function () {
        waitingDialog();
    });
    $(document).on('ajaxComplete', function () {
        closeWaitingDialog();
    });
    $(document).on('ajaxError', function (data, jqXHR, errorThrown) {
        if (jqXHR.status == 408) {
            // perform a redirect to the login page since we're no longer authorized
            alert("Sorry, Your Session time expired. You will be logged out.");
            window.location.replace("Login");
        }
        else {
            if (data.ErrorCode || jqXHR.status != 200)
                window.location.replace("Error");
            else
                window.location.reload();
        }
    });
});
/*************** Cookie *************************************/
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
/*************** Parslet Custom Validation *************************************/

function validationHelper(selector) {
    $(selector).parsley().subscribe('parsley:field:error', function (fieldInstance) {
        arrErrorMsg = ParsleyUI.getErrorsMessages(fieldInstance);
        errorMsg = arrErrorMsg.join(';');
        fieldInstance.$element.next('ul').remove();
        fieldInstance.$element
            .popover('destroy')
            .popover({
                container: 'body',
                placement: 'right',
                trigger: 'hover',
                content: errorMsg
            })

    });
    $(selector).parsley().subscribe('parsley:field:success', function (fieldInstance) {
        fieldInstance.$element.removeClass('parsley-success');
        fieldInstance.$element.popover('destroy');
    });
    $(selector).parsley().subscribe('parsley:field:validated', function (fieldInstance) {
        var $item = fieldInstance.$element;
        $item.removeClass('parsley-success');
        if ($item.hasClass('parsley-error')) {
            $item.css('margin-top', '0px');
            $item.css('padding-top', '0px');
            $item.css('height', '100%');
            $item.css('border', 'none');
        }
    });

    $(selector).blur();
    $(selector).find('input').blur();
    $(selector).removeClass("jqx-fill-state-focus");
}

function customValidation(validatorName, validationFunction, message, selector) {
    window.ParsleyValidator.addValidator(validatorName, validationFunction, 32)
   .addMessage('en', validatorName, message);

    validationHelper(selector);
}
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
function isEmail(emailAddress) {
    //var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  
    var email = "[A-Za-z0-9\._%-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,4}";
    var re = new RegExp('^' + email + '(;\\n*' + email + ')*;?$');
    return emailAddress == '' || re.test(emailAddress);
}
/************************ Get Url Parameter********************************************/
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};