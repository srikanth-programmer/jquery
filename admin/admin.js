$(document).ready(function () {
  $(".home").click(function () {
    window.location.href = "../index.html";
  });
  fetchRequests();
   
  function fetchRequests() {
    $.ajax({
      url: "http://localhost:3000/api/requests",
      method: "GET",
      success: function (data) {
        var tableBody = $("#requestsTable tbody");
        tableBody.empty();
        data.forEach(function (request) {
          var row = `<tr>
                        <td>${request.username}</td>
                        <td>${request.location}</td>
                        <td>${request.employeeId}</td>
                        <td>${request.email}</td>
                        <td>${request.reason}</td>
                        <td>${request.startDate}</td>
                        <td>${request.endDate}</td>
                        <td  >${request.approved}</td>
                        <td>
                        <button class="approve-btn class="action"" data-id="${
                          request.employeeId
                        }" ${
            request.approved != "pending" ? "disabled" : ""
          }>Approve</button>
                        <button class="reject-btn" data-id="${
                          request.employeeId
                        }" ${
            request.approved != "pending" ? "disabled" : ""
          }>Reject</button>
                    </td>
                    </tr>`;
          tableBody.append(row);
        });

        $(".approve-btn").click(function () {
          updateApprovalStatus($(this).data("id"), true);
        });

        $(".reject-btn").click(function () {
          updateApprovalStatus($(this).data("id"), false);
        });
      },
      error: function (error) {
        alert("Failed to fetch requests. Please try again.");
      },
    });
  }

  function updateApprovalStatus(employeeId, status) {
    employeeId = String(employeeId);
    console.log(employeeId);
    $.ajax({
      url: "http://localhost:3000/api/requests/update",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ employeeId: employeeId, approved: status }),
      success: function (response) {
        if (response.success) {
          fetchRequests();
        } else {
          alert("Failed to update status");
        }
      },
      error: function (error) {
        alert("Failed to update status. Please try again.");
      },
    });
  }
});
