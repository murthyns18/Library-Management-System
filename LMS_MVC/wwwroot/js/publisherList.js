function actionFormatter(cellValue, options, row) {
    return `
        <div class="text-nowrap">
            <button class="btn btn-sm btn-warning me-1 btn-edit" data-id="${row.publisherID}">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-delete"
                    data-id="${row.publisherID}"
                    data-name="${row.publisherName}">
                <i class="bi bi-trash"></i>
            </button>
        </div>`;
}

function statusFormatter(cellValue) {
    if (isExport) {
        return cellValue ? "Active" : "Inactive";
    }
    return cellValue
        ? "<span class='badge bg-success'>Active</span>"
        : "<span class='badge bg-danger'>Inactive</span>";
}

function reloadPublisherGrid() {
    $("#publisherGrid")
        .jqGrid('setGridParam', {
            datatype: 'json',
            page: 1
        })
        .trigger('reloadGrid');
}


function openAddPublisherModal() {
    $('#publisherForm')[0].reset();
    $('#PublisherID').val(0);
    $('#statusContainer').addClass('d-none');
    $('#publisherModalTitle').text('Add Publisher');
    $('#publisherModal').modal('show');
}

function openEditPublisherModal(publisherId) {
    $.get('/Publisher/EditPublisher', { publisherID: publisherId })
        .done(function (data) {

            $('#PublisherID').val(data.publisherID);
            $('#PublisherName').val(data.publisherName);

            $('input[name="IsActive"][value="' + data.isActive + '"]').prop('checked', true);

      
            $('#statusContainer').removeClass('d-none');

            $('#publisherModalTitle').text('Edit Publisher');
            $('#publisherModal').modal('show');
        })
        .fail(function () {
            App.alert('Failed to load publisher details.');
        });

}


async function deletePublisher(id, name) {

    const firstConfirm = await confirmAsync(`Are you sure you want to delete the publisher "${name}"?`);

    if (!firstConfirm) return;

    try {
        const result = await $.ajax({
            url: '/Publisher/DeletePublisher',
            type: 'POST',
            data: {
                publisherID: id,
                forceDelete: false,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        });

        if (!result.success && result.hasBooks) {

            const secondConfirm = await confirmAsync(
                `The publisher "${name}"  has books. Do you want to delete the publisher along with its books?`
            );

            if (!secondConfirm) return;

            const finalResult = await $.ajax({
                url: '/Publisher/DeletePublisher',
                type: 'POST',
                data: {
                    publisherID: id,
                    forceDelete: true,
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
                }
            });

            if (finalResult.success) {
                $("#publisherGrid").jqGrid("delRowData", id);
            }

            App.alert(finalResult.message);
        }
        else if (result.success) {
            $("#publisherGrid").jqGrid("delRowData", id);
            App.alert(result.message);
        }
        else {
            App.alert(result.message);
        }
    }
    catch {
        App.alert("Delete failed");
    }
}


$(document).on('click', '.btn-edit', function () {
    openEditPublisherModal($(this).data('id'));
});

$(document).on('click', '.btn-delete', function () {
    deletePublisher($(this).data('id'), $(this).data('name'));
});


$(function () {

    const colModels = [
        {
            label: "Action",
            name: "action",
            width: 30,
            align: "center",
            exportcol: false,
            sortable: false,
            search: false,
            formatter: actionFormatter
        },
        { name: "publisherID", key: true, hidden: true },
        { label: "Publisher Name", name: "publisherName", width: 50 },
        {
            label: "Status",
            name: "isActive",
            width: 30,
            align: "center",
            sortable: false,
            formatter: statusFormatter,
            stype: "select",
            searchoptions: {
                value: ":All;true:Active;false:Inactive",
                sopt: ["eq"]
            }
        }
    ];

    App.CreateJQGrid(
        '#publisherGrid',
        apiURL + 'Publisher/PublisherList',
        'json',
        [],
        colModels,
        TOKEN,
        true,
        false,
        "55vh"
    );
});

submitModalForm({
    formSelector: '#publisherForm',
    modalSelector: '#publisherModal',
    onSuccess: function () {
        reloadPublisherGrid();
    }
});



