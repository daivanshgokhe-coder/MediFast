const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router =
    express.Router();

const {
    uploadPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescriptionStatus
} =
    require("../controllers/prescriptionController");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


// ========================================
// UPLOAD DIRECTORY
// ========================================

const uploadDirectory =
    path.join(
        __dirname,
        "..",
        "uploads",
        "prescriptions"
    );


if (
    !fs.existsSync(
        uploadDirectory
    )
) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );
}


// ========================================
// MULTER STORAGE
// ========================================

const storage =
    multer.diskStorage({

        destination:
            function (
                req,
                file,
                cb
            ) {

                cb(
                    null,
                    uploadDirectory
                );

            },


        filename:
            function (
                req,
                file,
                cb
            ) {

                const extension =
                    path.extname(
                        file.originalname
                    );


                const uniqueName =
                    `prescription-${Date.now()}-${Math.round(
                        Math.random() * 1000000
                    )}${extension}`;


                cb(
                    null,
                    uniqueName
                );

            }

    });


// ========================================
// FILE FILTER
// ========================================

const fileFilter =
    function (
        req,
        file,
        cb
    ) {

        const allowedMimeTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf"

        ];


        if (
            allowedMimeTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only JPG, PNG and PDF files are allowed"
                )
            );

        }

    };


// ========================================
// MULTER
// ========================================

const upload =
    multer({

        storage,

        fileFilter,

        limits: {
            fileSize:
                5 * 1024 * 1024
        }

    });


// ========================================
// POST PRESCRIPTION
// ========================================

router.post(
    "/",
    authMiddleware,
    upload.single("prescription"),
    uploadPrescription
);


// ========================================
// GET USER PRESCRIPTIONS
// ========================================

router.get(
    "/",
    authMiddleware,
    getPrescriptions
);


// ========================================
// GET SINGLE PRESCRIPTION
// ========================================

router.get(
    "/:id",
    authMiddleware,
    getPrescriptionById
);


// ========================================
// ADMIN UPDATE STATUS
// ========================================

router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updatePrescriptionStatus
);


// ========================================
// MULTER ERROR HANDLER
// ========================================

router.use(
    function (
        error,
        req,
        res,
        next
    ) {

        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "File size must be 5MB or less"
                });

            }


            return res.status(400).json({
                success: false,
                message:
                    error.message
            });

        }


        if (error) {

            return res.status(400).json({
                success: false,
                message:
                    error.message
            });

        }


        next();

    }
);


module.exports =
    router;