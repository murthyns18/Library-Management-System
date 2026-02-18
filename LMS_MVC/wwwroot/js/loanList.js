
function actionFormatter(cellValue, options, row) {

    let html = `
        <div class="text-nowrap">
            <button class="btn btn-sm btn-danger btn-delete me-1"
                    data-id="${row.loanId}" data-user="${row.userName}">
                <i class="bi bi-trash"></i>
            </button>
    `;

    if (row.status === "Active") {
        html += `
            <button class="btn btn-sm btn-success btn-return"
                    data-id="${row.loanId}" data-user="${row.userName}">
                <i class="bi bi-arrow-return-left"></i>
            </button>
        `;
    }

    html += `</div>`;
    return html;
}

function statusFormatter(value) {
    if (isExport) {
        return value;
    }

    return value === "Closed"
        ? "<span class='badge bg-secondary'>Closed</span>"
        : "<span class='badge bg-success'>Active</span>";
}

function reloadLoanGrid() {
    $("#loanGrid")
        .jqGrid('setGridParam', {
            datatype: 'json',
            page: 1
        })
        .trigger('reloadGrid');
}

function dateFormatter(cellValue) {

    if (!cellValue) {
        return isExport
            ? "Not Returned"   
            : "<span class='text-danger fw-semibold'>Not Returned</span>";
    }

    const d = new Date(cellValue);

    if (isNaN(d)) {
        return isExport
            ? "Not Returned"
            : "<span class='text-danger fw-semibold'>Not Returned</span>";
    }

    return d.toLocaleDateString('en-GB');
}


async function deleteLoan(loanId, loan) {

    const confirmDelete = await confirmAsync( `Are you sure you want to delete the loan "${loan}"?` );

    if (!confirmDelete) return;

    try {
        const res = await $.ajax({
            url: '/Loan/DeleteLoan',
            type: 'POST',
            data: {
                loanId: loanId,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        });

        $("#loanGrid").jqGrid("delRowData", loanId);
        App.alert(res.message);
    }
    catch {
        App.alert("Delete failed");
    }
}

async function returnLoan(loanId, userName) {

    const confirmReturn = await confirmAsync(`Are you sure you want to return the loan for "${userName}"?`);

    if (!confirmReturn) return;

    try {
        const res = await $.ajax({
            url: '/Loan/ReturnLoan',
            type: 'POST',
            data: {
                loanId: loanId,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        });

        App.alert(res.message);
        reloadLoanGrid();
    }
    catch {
        App.alert("Return failed");
    }
}


$(document).on('click', '.btn-delete', function () {
    deleteLoan($(this).data('id'), $(this).data('user'));
});

$(document).on('click', '.btn-return', function () {
    returnLoan($(this).data('id'), $(this).data('user'));
});

$(function () {

    const colModels = [
        {
            label: "Action",
            name: "action",
            width: 120,
            align: "center",
            sortable: false,
            search: false,
            exportcol: false,
            formatter: actionFormatter
        },
        { name: "loanId", key: true, hidden: true },
        { label: "User Name", name: "userName", width: 150 },
        { label: "Total Qty", name: "totalQty", width: 80, align: "right" },
        {
            label: "Loan Date",
            name: "loanDate",
            width: 110,
            align: "center",
            formatter: dateFormatter
        },
        {
            label: "Due Date",
            name: "dueDate",
            width: 110,
            align: "center",
            formatter: dateFormatter
        },
        {
            label: "Return Date",
            name: "returnDate",
            width: 130,
            align: "center",
            search: false,
            formatter: dateFormatter
        },
        {
            label: "Status",
            name: "status",
            width: 120,
            align: "center",
            sortable: false,
            formatter: statusFormatter,
            stype: "select",
            searchoptions: {
                value: ":All;Active:Active;Closed:Closed"
            }
        }
    ];

    App.CreateJQGrid(
        '#loanGrid',
        apiURL + 'Loan/LoanList?loanId=0',
        'json',
        [],
        colModels,
        TOKEN,
        true,
        false,
        "55vh"
    );

    $("#loanGrid").jqGrid('filterToolbar', {
        searchOnEnter: false,
        defaultSearch: "cn",
        stringResult: true
    });
});


function openAddLoanModal() {
    selectedBooks = [];
    $("#loanDetailsContainer").empty();
    $("#tblSelectedBooks tbody").html(`
        <tr>
            <td colspan="4" class="text-center text-muted">
                No books added
            </td>
        </tr>
    `);

    $("#loanModal").modal("show");
}
