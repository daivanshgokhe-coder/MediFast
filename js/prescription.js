// ==========================================
// MEDIFAST - PRESCRIPTION
// NODE / EXPRESS / MONGODB VERSION
// ==========================================

const PRESCRIPTION_API =
    "https://medifast-oanf.onrender.com/api/orders";



// ==========================================
// GET TOKEN
// ==========================================

function getPrescriptionToken() {

    return localStorage.getItem("medifastToken");

}


// ==========================================
// GET CURRENT USER
// ==========================================

function getPrescriptionUser() {

    try {

        const user =
            localStorage.getItem("medifastUser");

        return user
            ? JSON.parse(user)
            : null;

    } catch (error) {

        console.error(
            "Unable to read user:",
            error
        );

        return null;
    }
}


// ==========================================
// CHECK ADMIN
// ==========================================

function isPrescriptionAdmin() {

    const user =
        getPrescriptionUser();

    return user &&
        String(user.role).toLowerCase() === "admin";

}


// ==========================================
// LOAD PRESCRIPTIONS
// ==========================================

async function loadPrescriptions() {

    const token =
        getPrescriptionToken();

    if (!token) {

        showPrescriptionMessage(
            "Please login first.",
            "error"
        );

        const container =
            document.getElementById(
                "uploaded-prescriptions"
            );

        if (container) {

            container.innerHTML = `
                <div class="no-prescriptions">
                    <h3>Please Login</h3>
                    <p>
                        Please login to view your prescriptions.
                    </p>
                    <a href="login.html"
                       class="view-prescription-btn">
                        Login
                    </a>
                </div>
            `;
        }

        return;
    }


    try {

        const response =
            await fetch(
                PRESCRIPTION_API,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load prescriptions."
            );
        }


        const prescriptions =
            Array.isArray(data.prescriptions)
                ? data.prescriptions
                : [];


        displayPrescriptions(
            prescriptions
        );


    } catch (error) {

        console.error(
            "Prescription API Error:",
            error
        );


        const container =
            document.getElementById(
                "uploaded-prescriptions"
            );


        if (container) {

            container.innerHTML = `
                <div class="no-prescriptions">
                    <h3>Unable to load prescriptions</h3>
                    <p>
                        ${escapeHtml(
                            error.message ||
                            "Please try again."
                        )}
                    </p>
                </div>
            `;
        }
    }
}


// ==========================================
// UPLOAD PRESCRIPTION
// ==========================================

async function uploadPrescription(event) {

    event.preventDefault();


    const token =
        getPrescriptionToken();


    if (!token) {

        showPrescriptionMessage(
            "Please login first.",
            "error"
        );

        return;
    }


    const doctorNameElement =
        document.getElementById(
            "doctor-name"
        );


    const notesElement =
        document.getElementById(
            "prescription-notes"
        );


    const fileElement =
        document.getElementById(
            "prescription-file"
        );


    const doctorName =
        doctorNameElement
            ? doctorNameElement.value.trim()
            : "";


    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";


    const file =
        fileElement &&
        fileElement.files
            ? fileElement.files[0]
            : null;


    // ======================================
    // VALIDATION
    // ======================================

    if (!doctorName) {

        showPrescriptionMessage(
            "Please enter doctor name.",
            "error"
        );

        return;
    }


    if (!file) {

        showPrescriptionMessage(
            "Please select a prescription file.",
            "error"
        );

        return;
    }


    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        showPrescriptionMessage(
            "Only JPG, PNG and PDF files are allowed.",
            "error"
        );

        return;
    }


    // Backend limit = 5 MB

    if (
        file.size >
        5 * 1024 * 1024
    ) {

        showPrescriptionMessage(
            "File size must be less than 5 MB.",
            "error"
        );

        return;
    }


    // ======================================
    // FORM DATA
    // Backend multer field = prescription
    // ======================================

    const formData =
        new FormData();


    formData.append(
        "doctorName",
        doctorName
    );


    formData.append(
        "notes",
        notes
    );


    formData.append(
        "prescription",
        file
    );


    try {

        const submitButton =
            document.getElementById(
                "submit-prescription-btn"
            );


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Uploading...";
        }


        showPrescriptionMessage(
            "Uploading prescription...",
            "success"
        );


        const response =
            await fetch(
                PRESCRIPTION_API,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Prescription upload failed."
            );
        }


        showPrescriptionMessage(
            "Prescription uploaded successfully.",
            "success"
        );


        // Reset form

        const form =
            document.getElementById(
                "prescription-form"
            );


        if (form) {

            form.reset();
        }


        // Reset selected file display

        const selectedFile =
            document.getElementById(
                "selected-file"
            );


        if (selectedFile) {

            selectedFile.textContent = "";

            selectedFile.style.display =
                "none";
        }


        // Reload prescription list

        await loadPrescriptions();


    } catch (error) {

        console.error(
            "Prescription Upload Error:",
            error
        );


        showPrescriptionMessage(
            error.message ||
            "Prescription upload failed.",
            "error"
        );


    } finally {

        const submitButton =
            document.getElementById(
                "submit-prescription-btn"
            );


        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "📤 Submit Prescription";
        }
    }
}


// ==========================================
// DISPLAY PRESCRIPTIONS
// ==========================================

function displayPrescriptions(
    prescriptions
) {

    const container =
        document.getElementById(
            "uploaded-prescriptions"
        );


    if (!container) {

        console.error(
            "uploaded-prescriptions element not found."
        );

        return;
    }


    if (
        !prescriptions ||
        prescriptions.length === 0
    ) {

        container.innerHTML = `
            <div class="no-prescriptions">

                <h3>
                    No prescriptions found
                </h3>

                <p>
                    Upload your prescription to continue.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        prescriptions
            .map(
                function (prescription) {

                    // ==================================
                    // STATUS
                    // ==================================

                    const status =
                        prescription.status ||
                        "Submitted";


                    const safeStatus =
                        normalizeStatus(
                            status
                        );


                    const statusClass =
                        getStatusClass(
                            safeStatus
                        );


                    // ==================================
                    // DATA
                    // ==================================

                    const date =
                        formatPrescriptionDate(
                            prescription.createdAt
                        );


                    const fileName =
                        prescription.fileName ||
                        "Prescription file";


                    const doctorName =
                        prescription.doctorName ||
                        "Not provided";


                    const notes =
                        prescription.notes ||
                        "";


                    const prescriptionId =
                        prescription._id ||
                        prescription.id ||
                        "";


                    // ==================================
                    // FILE URL
                    // ==================================

                    const fileUrl =
                        prescription.fileUrl ||
                        "";


                    // ==================================
                    // ADMIN STATUS CONTROL
                    // ==================================

                    const adminControls =
                        isPrescriptionAdmin()
                            ? createAdminStatusControls(
                                prescriptionId,
                                safeStatus
                            )
                            : "";


                    return `

                        <div class="prescription-record">

                            <div class="prescription-record-header">

                                <h3>
                                    📄 Prescription
                                </h3>

                                <span class="
                                    prescription-status
                                    ${statusClass}
                                ">
                                    ${escapeHtml(
                                        safeStatus
                                    )}
                                </span>

                            </div>


                            <div class="prescription-info">

                                <p>

                                    <strong>
                                        Doctor:
                                    </strong>

                                    ${escapeHtml(
                                        doctorName
                                    )}

                                </p>


                                <p>

                                    <strong>
                                        File:
                                    </strong>

                                    ${escapeHtml(
                                        fileName
                                    )}

                                </p>


                                <p>

                                    <strong>
                                        Status:
                                    </strong>

                                    <span class="
                                        prescription-status
                                        ${statusClass}
                                    ">
                                        ${escapeHtml(
                                            safeStatus
                                        )}
                                    </span>

                                </p>


                                <p>

                                    <strong>
                                        Uploaded:
                                    </strong>

                                    ${date}

                                </p>


                                ${
                                    notes
                                        ? `
                                            <p>

                                                <strong>
                                                    Notes:
                                                </strong>

                                                ${escapeHtml(
                                                    notes
                                                )}

                                            </p>
                                        `
                                        : ""
                                }

                            </div>


                            ${
                                fileUrl
                                    ? `
                                        <a
                                            href="${escapeAttribute(
                                                fileUrl
                                            )}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="view-prescription-btn">
                                            
                                            👁️ View Prescription

                                        </a>
                                    `
                                    : ""
                            }


                            ${adminControls}

                        </div>

                    `;
                }
            )
            .join("");
}


// ==========================================
// ADMIN STATUS CONTROLS
// ==========================================

function createAdminStatusControls(
    prescriptionId,
    currentStatus
) {

    if (!prescriptionId) {

        return "";
    }


    return `

        <div class="admin-status-box">

            <label>
                👨‍💼 Admin: Update Prescription Status
            </label>

            <div class="admin-status-row">

                <select
                    id="status-${prescriptionId}">

                    <option
                        value="Submitted"
                        ${
                            currentStatus === "Submitted"
                                ? "selected"
                                : ""
                        }>
                        Submitted
                    </option>

                    <option
                        value="Under Review"
                        ${
                            currentStatus === "Under Review"
                                ? "selected"
                                : ""
                        }>
                        Under Review
                    </option>

                    <option
                        value="Approved"
                        ${
                            currentStatus === "Approved"
                                ? "selected"
                                : ""
                        }>
                        Approved
                    </option>

                    <option
                        value="Rejected"
                        ${
                            currentStatus === "Rejected"
                                ? "selected"
                                : ""
                        }>
                        Rejected
                    </option>

                </select>


                <button
                    type="button"
                    class="update-status-btn"
                    onclick="updatePrescriptionStatus('${escapeAttribute(
                        prescriptionId
                    )}')">

                    Update Status

                </button>

            </div>

        </div>

    `;
}


// ==========================================
// UPDATE PRESCRIPTION STATUS
// ADMIN ONLY
// ==========================================

async function updatePrescriptionStatus(
    prescriptionId
) {

    const token =
        getPrescriptionToken();


    if (!token) {

        showPrescriptionMessage(
            "Please login first.",
            "error"
        );

        return;
    }


    if (!isPrescriptionAdmin()) {

        showPrescriptionMessage(
            "Only admin can update prescription status.",
            "error"
        );

        return;
    }


    const select =
        document.getElementById(
            `status-${prescriptionId}`
        );


    if (!select) {

        showPrescriptionMessage(
            "Status selector not found.",
            "error"
        );

        return;
    }


    const status =
        select.value;


    try {

        const button =
            select
                .parentElement
                .querySelector(
                    ".update-status-btn"
                );


        if (button) {

            button.disabled = true;

            button.textContent =
                "Updating...";
        }


        const response =
            await fetch(
                `${PRESCRIPTION_API}/${encodeURIComponent(
                    prescriptionId
                )}/status`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update prescription status."
            );
        }


        showPrescriptionMessage(
            `Prescription status updated to "${status}".`,
            "success"
        );


        // Reload list so latest status is visible

        await loadPrescriptions();


    } catch (error) {

        console.error(
            "Prescription Status Update Error:",
            error
        );


        showPrescriptionMessage(
            error.message ||
            "Unable to update prescription status.",
            "error"
        );


    } finally {

        const updatedSelect =
            document.getElementById(
                `status-${prescriptionId}`
            );


        if (updatedSelect) {

            const button =
                updatedSelect
                    .parentElement
                    .querySelector(
                        ".update-status-btn"
                    );


            if (button) {

                button.disabled = false;

                button.textContent =
                    "Update Status";
            }
        }
    }
}


// ==========================================
// NORMALIZE STATUS
// ==========================================

function normalizeStatus(status) {

    const value =
        String(status || "")
            .trim()
            .toLowerCase();


    if (value === "submitted") {

        return "Submitted";
    }


    if (
        value === "under review" ||
        value === "under-review" ||
        value === "under_review"
    ) {

        return "Under Review";
    }


    if (value === "approved") {

        return "Approved";
    }


    if (value === "rejected") {

        return "Rejected";
    }


    return "Submitted";
}


// ==========================================
// STATUS CSS CLASS
// ==========================================

function getStatusClass(status) {

    switch (status) {

        case "Submitted":
            return "status-submitted";

        case "Under Review":
            return "status-under-review";

        case "Approved":
            return "status-approved";

        case "Rejected":
            return "status-rejected";

        default:
            return "status-unknown";
    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatPrescriptionDate(date) {

    if (!date) {

        return "-";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";
    }


    return parsedDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// SELECTED FILE DISPLAY
// ==========================================

function setupFileInput() {

    const fileInput =
        document.getElementById(
            "prescription-file"
        );


    const selectedFile =
        document.getElementById(
            "selected-file"
        );


    if (
        !fileInput ||
        !selectedFile
    ) {

        return;
    }


    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files &&
                fileInput.files[0];


            if (!file) {

                selectedFile.textContent = "";

                selectedFile.style.display =
                    "none";

                return;
            }


            selectedFile.textContent =
                `Selected file: ${file.name}`;


            selectedFile.style.display =
                "block";
        }
    );
}


// ==========================================
// MESSAGE
// ==========================================

function showPrescriptionMessage(
    message,
    type = "success"
) {

    const element =
        document.getElementById(
            "prescription-message"
        );


    if (!element) {

        alert(message);

        return;
    }


    element.textContent =
        message;


    element.className =
        `prescription-message message ${type}`;


    element.style.display =
        "block";


    setTimeout(
        function () {

            element.style.display =
                "none";

        },
        4000
    );
}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// ATTRIBUTE ESCAPE
// ==========================================

function escapeAttribute(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "prescription-form"
            );


        if (form) {

            form.addEventListener(
                "submit",
                uploadPrescription
            );
        }


        setupFileInput();


        loadPrescriptions();

    }
);s