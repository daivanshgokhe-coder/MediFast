const fs = require("fs");
const path = require("path");

const Prescription =
    require("../models/Prescription");


// ========================================
// UPLOAD PRESCRIPTION
// ========================================

async function uploadPrescription(
    req,
    res
) {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "Prescription file is required"
            });
        }


        const doctorName =
            req.body.doctorName;


        const notes =
            req.body.notes || "";


        if (!doctorName) {

            // Delete uploaded file if validation fails

            if (
                req.file.path &&
                fs.existsSync(req.file.path)
            ) {

                fs.unlinkSync(
                    req.file.path
                );
            }


            return res.status(400).json({
                success: false,
                message:
                    "Doctor name is required"
            });
        }


        const filePath =
            path
                .relative(
                    path.join(
                        __dirname,
                        ".."
                    ),
                    req.file.path
                )
                .replace(/\\/g, "/");


        const prescription =
            await Prescription.create({

                userId:
                    req.user._id,

                doctorName:
                    doctorName.trim(),

                fileName:
                    req.file.originalname,

                filePath,

                notes

            });


        res.status(201).json({

            success: true,

            message:
                "Prescription uploaded successfully",

            prescription

        });

    } catch (error) {

        console.error(
            "Upload Prescription Error:",
            error
        );


        if (
            req.file &&
            req.file.path &&
            fs.existsSync(req.file.path)
        ) {

            try {

                fs.unlinkSync(
                    req.file.path
                );

            } catch (deleteError) {

                console.error(
                    "File cleanup error:",
                    deleteError
                );
            }
        }


        res.status(500).json({
            success: false,
            message:
                "Unable to upload prescription"
        });
    }
}


// ========================================
// GET USER PRESCRIPTIONS
// ========================================

async function getPrescriptions(
    req,
    res
) {

    try {

        const prescriptions =
            await Prescription.find({
                userId:
                    req.user._id
            })
            .sort({
                createdAt: -1
            });


        const formatted =
            prescriptions.map(
                function (item) {

                    return {

                        ...item.toObject(),

                        fileUrl:
                            `${req.protocol}://${req.get("host")}/${item.filePath}`

                    };

                }
            );


        res.json({

            success: true,

            count:
                formatted.length,

            prescriptions:
                formatted

        });

    } catch (error) {

        console.error(
            "Get Prescriptions Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch prescriptions"
        });
    }
}


// ========================================
// GET SINGLE PRESCRIPTION
// ========================================

async function getPrescriptionById(
    req,
    res
) {

    try {

        const prescription =
            await Prescription.findOne({

                _id:
                    req.params.id,

                userId:
                    req.user._id

            });


        if (!prescription) {

            return res.status(404).json({
                success: false,
                message:
                    "Prescription not found"
            });
        }


        res.json({

            success: true,

            prescription: {

                ...prescription.toObject(),

                fileUrl:
                    `${req.protocol}://${req.get("host")}/${prescription.filePath}`

            }

        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                "Invalid prescription ID"
        });
    }
}


// ========================================
// UPDATE PRESCRIPTION STATUS
// ========================================

async function updatePrescriptionStatus(
    req,
    res
) {

    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "Submitted",
            "Under Review",
            "Approved",
            "Rejected"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid prescription status"
            });
        }


        const prescription =
            await Prescription.findByIdAndUpdate(
                req.params.id,
                {
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!prescription) {

            return res.status(404).json({
                success: false,
                message:
                    "Prescription not found"
            });
        }


        res.json({

            success: true,

            message:
                "Prescription status updated successfully",

            prescription

        });

    } catch (error) {

        console.error(
            "Update Prescription Status Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update prescription status"
        });
    }
}


module.exports = {

    uploadPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescriptionStatus

};