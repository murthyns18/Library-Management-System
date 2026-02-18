$.ajaxSetup({
    beforeSend: function (xhr) {
        if (typeof TOKEN !== "undefined" && TOKEN) {
            xhr.setRequestHeader("Authorization", "Bearer " + TOKEN);
        }
    }
});

let selectedBooks = [];

function loadUsers() {
    $.ajax({
        url: apiURL + "User/UserList",
        type: "GET",
        data: { userID: -1 },
        success: function (data) {
            $("#ddlUser")
                .empty()
                .append(`<option value="">-- Select User --</option>`);

            data.forEach(u => {
                $("#ddlUser").append(
                    `<option value="${u.userID}">${u.userName}</option>`
                );
            });
        }
    });
}

$("#ddlUser").on("change", function () {
    const userID = $(this).val();
    if (!userID) return;

    $.ajax({
        url: apiURL + "User/UserList",
        type: "GET",
        data: { userID: userID },
        success: function (data) {
            const u = data[0];
            $("#txtName").val(u.userName);
            $("#txtEmail").val(u.email);
            $("#txtAddress").val(u.address);
            $("#txtMobile").val(u.mobileNumber);
        }
    });
});


function loadPublishers() {
    $.ajax({
        url: apiURL + "Publisher/PublisherList",
        type: "GET",
        data: { publisherID: -1 },
        success: function (data) {
            $("#ddlPublisher")
                .empty()
                .append(`<option value="">-- Select Publisher --</option>`);

            data.forEach(p => {
                $("#ddlPublisher").append(
                    `<option value="${p.publisherID}">${p.publisherName}</option>`
                );
            });
        },
        error: function () {
            App.alert("Failed to load publishers.");
        }
    });
}


$("#ddlPublisher").on("change", function () {

    const publisherId = $(this).val();

    $("#ddlBook")
        .empty()
        .append(`<option value="">-- Select Book --</option>`);

    if (!publisherId) return;

    $.ajax({
        url: apiURL + "Book/GetBooksByPublisher",
        type: "GET",
        data: { publisherId: publisherId },
        success: function (data) {

            if (!data || data.length === 0) {
                App.alert("No books available for this publisher");
                return;
            }

            data.forEach(b => {
                $("#ddlBook").append(
                    `<option value="${b.bookID}">${b.title}</option>`
                );
            });
        },
        error: function () {
            App.alert("Failed to load books");
        }
    });
});

function addBook() {

    const bookId = $("#ddlBook").val();
    const bookName = $("#ddlBook option:selected").text();
    const publisherName = $("#ddlPublisher option:selected").text();

    if (!bookId) {
        App.alert("Please select a book");
        return;
    }

    if (selectedBooks.length >= 4) {
        App.alert("Maximum 4 books allowed");
        return;
    }

    if (selectedBooks.some(b => b.bookId == bookId)) {
        App.alert("Book already added");
        return;
    }

    selectedBooks.push({
        bookId: parseInt(bookId),
        bookName: bookName,
        publisherName: publisherName
    });

    renderSelectedBooks();

    // reset dropdowns
    $("#ddlPublisher").val("");
    $("#ddlBook")
        .empty()
        .append(`<option value="">-- Select Book --</option>`);
}


function removeBook(bookId) {
    selectedBooks = selectedBooks.filter(b => b.bookId !== bookId);
    renderSelectedBooks();
}

function renderSelectedBooks() {

    const tbody = $("#tblSelectedBooks tbody");
    tbody.empty();

    if (selectedBooks.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="4" class="text-center text-muted">
                    No books added
                </td>
            </tr>
        `);
        return;
    }

    selectedBooks.forEach(b => {
        tbody.append(`
            <tr>
                <td>
                    <button class="btn btn-sm btn-danger"
                            onclick="removeBook(${b.bookId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                <td>${b.bookName}</td>
                <td>${b.publisherName}</td>
                <td class="text-center">1</td>
            </tr>
        `);
    });
}


function submitLoan() {

    const userID = $("#ddlUser").val();

    if (!userID) {
        App.alert("Please select user");
        return false;
    }

    if (selectedBooks.length === 0) {
        App.alert("Add at least one book");
        return false;
    }

    $("#UserId").val(userID);

    const container = $("#loanDetailsContainer");
    container.empty();

    selectedBooks.forEach((b, i) => {
        container.append(`
            <input type="hidden" name="LoanDetails[${i}].BookId" value="${b.bookId}" />
            <input type="hidden" name="LoanDetails[${i}].Qty" value="1" />
        `);
    });

    return true;
}


$(function () {
    loadUsers();
    loadPublishers();
    renderSelectedBooks();
});
