function actionFormatter(cellValue, options, row) {
    return `
        <div class="text-nowrap">
            <a href="/User/EditUser?q=${Encrypt('userID' + row.userID)}"
               class="btn btn-sm btn-warning me-1">
                <i class="bi bi-pencil-square"></i>
            </a>
            <button class="btn btn-sm btn-danger btn-delete"
                    data-id="${row.userID}"
                    data-name="${row.userName}">
                <i class="bi bi-trash"></i>
            </button>
        </div>`;
}
function dateFormatter(cellValue) {
    if (!cellValue) return "-";

    const date = new Date(cellValue);
    return date.toLocaleDateString("en-GB");
}
function statusFormatter(cellValue) {
    if (isExport) {
        return cellValue ? "Active" : "Inactive";
    }

    return cellValue
        ? "<span class='badge bg-success'>Active</span>"
        : "<span class='badge bg-danger'>Inactive</span>";
}

function arrayFormatter(cellValue) {
    if (!cellValue) return "-";

    if (Array.isArray(cellValue))
        return cellValue.join(", ");

    return cellValue;
}

function mobileFormatter(cellValue) {
    if (!cellValue) return "";

    return isExport
        ? "'" + cellValue
        : cellValue;
}

async function deleteUser(userID, name) {

    const confirmDelete = await confirmAsync(`Are you sure you want to delete the user "${name}"?` );

    if (!confirmDelete) return;

    try {
        const result = await $.ajax({
            url: '/User/DeleteUser',
            type: 'POST',
            data: {
                userID: userID,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        });

        if (result.success) {
            $("#userGrid").jqGrid("delRowData", userID);
        }

        App.alert(result.message);
    }
    catch {
        App.alert("Delete failed");
    }
}


$(document).on('click', '.btn-delete', function () {
    deleteUser($(this).data('id'), $(this).data('name'));
});

function getRoleFilter() {
    let result = ":All";
    $.ajax({
        url: apiURL + "Role/GetRoles",
        async: false,
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Bearer " + TOKEN),
        success: function (data) {
            data.forEach(r => {
                result += `;${r.roleName}:${r.roleName}`;
            });
        }
    });
    return result;
}

$(function () {

    if (!$('#userGrid').length) return;

    const colModels = [
        { label: "Action", name: "action", width: 150, align: "center", formatter: actionFormatter, search: false, exportcol: false },
        { name: "userID", key: true, hidden: true },
        { label: "Name", name: "userName", width: 150 },
        { label: "Email", name: "email", width: 220 },
        {
            label: "DOB",
            name: "dob",
            width: 110,
            align: "center",
            formatter: dateFormatter
        },
        {
            label: "Mobile",
            name: "mobileNumber",
            width: 120,
            align: "right",
            formatter: mobileFormatter
        },
        { label: "Address", name: "address", width: 150 },
        {
            label: "Languages",
            name: "languagesKnown",
            width: 180,
            formatter: arrayFormatter,
            search: false
        },
        {
            label: "Categories",
            name: "interestedCategories",
            width: 180,
            formatter: arrayFormatter,
            search: false
        },
        {
            label: "Status",
            name: "status",
            width: 100,
            align: "center",
            formatter: statusFormatter,
            stype: "select",
            searchoptions: { value: ":All;true:Active;false:Inactive", sopt: ["eq"] }
        }
    ];

    App.CreateJQGrid(
        '#userGrid',
        apiURL + 'User/UserList',
        'json',
        [],
        colModels,
        TOKEN,
        true,
        false,
        "55vh"
    );
});

function loadCountries() {
    $.ajax({
        url: apiURL + "User/GetCountries",
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Bearer " + TOKEN),
        success: function (data) {
            let html = '';
            data.forEach(c => {
                html += `<li data-id="${c.countryId}">${c.countryName}</li>`;
            });
            $('#countryList').html(html);
        }
    });
}

$('#countryList').on('click', 'li', function () {
    const countryId = $(this).data('id');
    $('#CountryId').val(countryId);

    $('#countryList li').removeClass('active');
    $(this).addClass('active');

    $('#stateColumn').removeClass('d-none');
    $('#cityColumn').addClass('d-none');
    $('#StateId, #CityId').val('');

    $.ajax({
        url: apiURL + "User/GetStates",
        data: { countryId },
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Bearer " + TOKEN),
        success: function (states) {
            let html = '';
            states.forEach(s => {
                html += `<li data-id="${s.stateId}">${s.stateName}</li>`;
            });
            $('#stateList').html(html);
        }
    });
});

$('#stateList').on('click', 'li', function () {
    const stateId = $(this).data('id');
    $('#StateId').val(stateId);

    $('#stateList li').removeClass('active');
    $(this).addClass('active');

    $('#cityColumn').removeClass('d-none');
    $('#CityId').val('');

    $.ajax({
        url: apiURL + "User/GetCities",
        data: { stateId },
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Bearer " + TOKEN),
        success: function (cities) {
            let html = '';
            cities.forEach(c => {
                html += `<li data-id="${c.cityId}">${c.cityName}</li>`;
            });
            $('#cityList').html(html);
        }
    });
});

$('#cityList').on('click', 'li', function () {
    $('#CityId').val($(this).data('id'));
    $('#cityList li').removeClass('active');
    $(this).addClass('active');
});

$(document).ready(function () {
    if ($('#countryList').length) {
        loadCountries();
    }
});

function updateLanguages() {
    const values = [];
    $('.langChk:checked').each(function () {
        values.push($(this).val());
    });
    $('#LanguagesKnownCsv').val(values.join(','));
}

$('.langChk').on('change', updateLanguages);

$('#InterestedCategories').on('change', function () {
    $('#InterestedCategoriesCsv').val($(this).val()?.join(','));
});

$(document).ready(function () {
    updateLanguages();
    $('#InterestedCategories').trigger('change');
});


