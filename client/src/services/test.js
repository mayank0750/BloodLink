import {
    authHeader,
    authHeaderToPost,
    handleResponse,
    ExamMGMAPI,
    FinanceAPI
} from "@/_services/api";

export const examSettingService = {
    saveInternalTool,
    getInternalToolsBySubjects,
    getInternalToolById,
    deleteInternalTool,
    getToolNames,
    saveExternalTool,
    getExternalToolsBySubjects,
    getExternalToolById,
    deleteExternalTool,
    // Exam Template functions
    createExamTemplate,
    getAllExamTemplates,
    getExamTemplateById,
    getExamTemplateByName,
    updateExamTemplate,
    deleteExamTemplate,
    // Teacher Duty Allocation functions
    createTeacherDutyAllocation,
    createTeacherDutyAllocationBulk,
    getTeacherDutyAllocationsByCollege,
    getTeacherDutyAllocationsBySchedules,
    getTeacherDutyAllocationById,
    getTeacherDutyAllocationByTeacherScheduleSubject,
    deleteTeacherDutyAllocation,
    // Exam Forms functions
    createExamForm,
    updateExamForm,
    getExamFormsByCollege,
    deleteExamForm,
    pushExamFormStudent,

    saveResultConfigurations,
    getResultConfigurations,
    UpdateResultConfigurations,
    getExamFees,

    createAutomaticPaperConfig,
    getAutomaticPaperConfigsByCollege,
    getAutomaticPaperConfigById,
    updateAutomaticPaperConfig,
    deleteAutomaticPaperConfig,


    createWorkflow,
    updateWorkflow,
    getWorkflowById,
    getWorkflowsByCollegeId,
    deleteWorkflow,

    createAttendanceConfig,
    BulkAttendanceConfig,
    updateAttendanceConfig,
    getAttendanceConfigsByCollege,
    deleteAttendanceConfig,

    osmEncryptedPost,
    osmEncryptedGetByCollege,
    osmEncryptedDelete,

    // Moderation Configuration functions
    createModerationConfig,
    updateModerationConfig,
    getModerationConfigById,
    getModerationsByResultConfig,
    toggleModeration,
    deleteModerationConfig,
    previewModeration
};

const BaseUrl = `${ExamMGMAPI}/v1/evaluation-workflow-config`;
const AttendanceBaseUrl = `${ExamMGMAPI}/admin/attendance-marks-config`;

/**
 * POST: Create Exam Tool (ARRAY)
 * /api/admin/exam-tools?type=INTERNAL
 */
function saveInternalTool(values, type = "INTERNAL") {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(values)
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools?type=${type}`,
        requestOptions
    ).then(handleResponse);
}

function saveExternalTool(values, type = "EXTERNAL") {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(values)
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools?type=${type}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Exam Tools by Subjects
 * /api/admin/exam-tools/by-subjects?subjectIds=16,17&type=INTERNAL
 */
function getInternalToolsBySubjects(
    subjectIds = [],
    type = "INTERNAL",
    programId,
    classYearId,
    semesterId
) {
    const ids = subjectIds.join(",");

    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    const queryParams = new URLSearchParams({
        subjectIds: ids,
        type,
        programId,
        classYearId,
        semesterId
    });

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/by-subjects?${queryParams.toString()}`,
        requestOptions
    ).then(handleResponse);
}


/**
 * GET: Exam Tool by ID
 * /api/admin/exam-tools/{id}?type=INTERNAL
 */
function getInternalToolById(id, type = "INTERNAL") {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/${id}?type=${type}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete Exam Tool
 * /api/admin/exam-tools/{id}?type=INTERNAL
 */
// DELETE /api/admin/exam-tools/delete?ids=12, 13,14&type=INTERNAL
function deleteInternalTool(ids, type = "INTERNAL") {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/delete?ids=${ids}&type=${type}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * PUT: Update Exam Tool
 * /api/admin/exam-tools/{id}?type=INTERNAL
 */

/**
 * GET: Get Tool Names from API
 * /api/admin/exam-tools/tool-names
 * This returns array of objects with: { exam_tool_type_name_id, exam_tool_type_name }
 */
function getToolNames() {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/tool-names`,
        requestOptions
    ).then(handleResponse);
}


function getExternalToolsBySubjects(
    subjectIds = [],
    type = "EXTERNAL",
    programId,
    classYearId,
    semesterId
) {
    const ids = subjectIds.join(",");

    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    const queryParams = new URLSearchParams({
        subjectIds: ids,
        type,
        programId,
        classYearId,
        semesterId
    });

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/by-subjects?${queryParams.toString()}`,
        requestOptions
    ).then(handleResponse);
}


/**
 * GET: Exam Tool by ID
 * /api/admin/exam-tools/{id}?type=INTERNAL
 */
function getExternalToolById(id, type = "EXTERNAL") {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/${id}?type=${type}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete Exam Tool
 * /api/admin/exam-tools/{id}?type=INTERNAL
 */
function deleteExternalTool(ids, type = "EXTERNAL") {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-tools/delete?ids=${ids}&type=${type}`,
        requestOptions
    ).then(handleResponse);
}

// ==================== EXAM TEMPLATE API FUNCTIONS ====================

/**
 * POST: Create Exam Template
 * /api/exam-templates
 */
function createExamTemplate(templateData) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(templateData)
    };

    return fetch(
        `${ExamMGMAPI}/exam-templates`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get All Exam Templates
 * /api/exam-templates
 */
function getAllExamTemplates() {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam-templates`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Exam Template by ID
 * /api/exam-templates/{id}
 */
function getExamTemplateById(id) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam-templates/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Exam Template by Name
 * /api/exam-templates/name/{name}
 */
function getExamTemplateByName(name) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam-templates/name/${encodeURIComponent(name)}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * PUT: Update Exam Template
 * /api/exam-templates/{id}
 */
function updateExamTemplate(id, templateData) {
    const requestOptions = {
        method: "PUT",
        headers: authHeaderToPost(),
        body: JSON.stringify(templateData)
    };

    return fetch(
        `${ExamMGMAPI}/exam-templates/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete Exam Template
 * /api/exam-templates/{id}
 */
function deleteExamTemplate(id) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam-templates/${id}`,
        requestOptions
    ).then(handleResponse);
}

// ==================== TEACHER DUTY ALLOCATION API FUNCTIONS ====================

/**
 * POST: Create Teacher Duty Allocation
 * /api/admin/teacher-duty-allocations?override=true
 */
function createTeacherDutyAllocation(allocationData) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(allocationData)
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations?override=true`,
        requestOptions
    ).then(handleResponse);
}

function createTeacherDutyAllocationBulk(allocationData) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(allocationData)
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations/bulk?override=true`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Teacher Duty Allocations by College ID
 * /api/admin/teacher-duty-allocations/by-college/{collegeId}
 */
function getTeacherDutyAllocationsByCollege(collegeId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations/by-college/${collegeId}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Teacher Duty Allocations by Schedule IDs
 * /api/admin/teacher-duty-allocations/by-schedules?scheduleIds=11
 */
function getTeacherDutyAllocationsBySchedules(scheduleIds) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations/by-schedules?scheduleIds=${scheduleIds}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Teacher Duty Allocation by ID
 * /api/admin/teacher-duty-allocations/by-id/{allocationId}
 */
function getTeacherDutyAllocationById(allocationId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations/by-id/${allocationId}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Teacher Duty Allocation by Teacher, Schedule and Subject
 * /api/admin/teacher-duty-allocations/by-teacher-schedule-subject?teacherId=1&examScheduleId=2&subjectId=3
 */
function getTeacherDutyAllocationByTeacherScheduleSubject(teacherId, examScheduleId, subjectId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations/by-teacher-schedule-subject?teacherId=${teacherId}&examScheduleId=${examScheduleId}&subjectId=${subjectId}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete Teacher Duty Allocation
 * /api/admin/teacher-duty-allocations/{teacherDutyAllocationId}
 */
function deleteTeacherDutyAllocation(teacherDutyAllocationId) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/teacher-duty-allocations/${teacherDutyAllocationId}`,
        requestOptions
    ).then(handleResponse);
}


function saveResultConfigurations(values) {
    // /api/admin/result-configuration/college/{collegeId}
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(values)
    };

    return fetch(
        `${ExamMGMAPI}/admin/result-configuration`,
        requestOptions
    ).then(handleResponse);
}

function getResultConfigurations(collegeId) {
    // /api/admin/result-configuration/college/{collegeId}
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/result-configuration/college/${collegeId}`,
        requestOptions
    ).then(handleResponse);
}

function UpdateResultConfigurations(id, values) {
    const requestOptions = {
        method: "PUT",
        headers: authHeaderToPost(),
        body: JSON.stringify(values)
    };

    return fetch(
        `${ExamMGMAPI}/admin/result-configuration/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Exam Fees
 * /api/admin/fee-types/for-exam/exam-fees?collegeId=16&isExam=true
 */
function getExamFees(collegeId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${FinanceAPI}/admin/fee-types/for-exam/exam-fees?collegeId=${collegeId}&isExam=true`,
        requestOptions
    ).then(handleResponse);
}

// ==================== EXAM FORMS API FUNCTIONS ====================

/**
 * POST: Create Exam Form
 * /api/admin/exam-forms
 * Payload: {
 *   "college_id": 12,
 *   "exam_form_id": 101,
 *   "program_id": 5,
 *   "program_name": "B.Tech Computer Science",
 *   "batch_id": 12,
 *   "batch_name": "2022-2026",
 *   "academic_year_id": 3,
 *   "academic_year_name": "2025-2026",
 *   "exam_form_name": "End Semester Examination",
 *   "application_last_date": "2026-02-15T23:59:59",
 *   "student_ids": [1001, 1002, 1003, 1004],
 *   "fee_type_id": 45
 * }
 */
function createExamForm(examFormData) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(examFormData)
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-forms`,
        requestOptions
    ).then(handleResponse);
}


function pushExamFormStudent(examFormData) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(examFormData)
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-forms/add-students`,
        requestOptions
    ).then(handleResponse);
}
/**
 * PUT: Update Exam Form
 * /api/admin/exam-forms
 * Same payload as create
 */
function updateExamForm(examFormData) {
    const requestOptions = {
        method: "PUT",
        headers: authHeaderToPost(),
        body: JSON.stringify(examFormData)
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-forms`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Exam Forms by College ID
 * /api/admin/exam-forms/college/{collegeId}
 */
function getExamFormsByCollege(collegeId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-forms/college/${collegeId}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete Exam Form
 * /api/admin/exam-forms/{id}
 */
function deleteExamForm(examFormId) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/exam-forms/${examFormId}`,
        requestOptions
    ).then(handleResponse);
}


/**
 * POST: Create Automatic Paper Config
 * /pms/api/exam/config/automatic-paper
 */
function createAutomaticPaperConfig(data) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(data)
    };

    return fetch(
        `${ExamMGMAPI}/exam/config/automatic-paper`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Automatic Paper Configs by College
 * /pms/api/exam/config/automatic-paper?college_id=5
 */
function getAutomaticPaperConfigsByCollege(collegeId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam/config/automatic-paper?college_id=${collegeId}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Automatic Paper Config by ID
 * /pms/api/exam/config/automatic-paper/{id}
 */
function getAutomaticPaperConfigById(id) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam/config/automatic-paper/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * PUT: Update Automatic Paper Config
 * /pms/api/exam/config/automatic-paper/{id}
 */
function updateAutomaticPaperConfig(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: authHeaderToPost(),
        body: JSON.stringify(data)
    };

    return fetch(
        `${ExamMGMAPI}/exam/config/automatic-paper/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete Automatic Paper Config
 * /pms/api/exam/config/automatic-paper/{id}
 */
function deleteAutomaticPaperConfig(id) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/exam/config/automatic-paper/${id}`,
        requestOptions
    ).then(handleResponse);
}


/**
 * POST: Create Evaluation Workflow Config
 * /api/v1/evaluation-workflow-config/create
 */
function createWorkflow(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderToPost(),
        body: JSON.stringify(data),
    };
    return fetch(`${BaseUrl}/create`, requestOptions)
        .then(handleResponse);
}

/**
 * PUT: Update Evaluation Workflow Config
 * /api/v1/evaluation-workflow-config/update/{id}
 */
function updateWorkflow(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeaderToPost(),
        body: JSON.stringify(data),
    };
    return fetch(`${BaseUrl}/update/${id}`, requestOptions)
        .then(handleResponse);
}

/**
 * GET: Get Workflow Config By ID
 * /api/v1/evaluation-workflow-config/{id}
 */
function getWorkflowById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    return fetch(`${BaseUrl}/${id}`, requestOptions)
        .then(handleResponse);
}

/**
 * GET: Get All Workflow Configs By College
 * /api/v1/evaluation-workflow-config/college/{collegeId}
 */
function getWorkflowsByCollegeId(collegeId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    return fetch(`${BaseUrl}/college/${collegeId}`, requestOptions)
        .then(handleResponse);
}

/**
 * DELETE: Delete Workflow Config
 * /api/v1/evaluation-workflow-config/delete/{id}
 */
function deleteWorkflow(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
    };
    return fetch(`${BaseUrl}/delete/${id}`, requestOptions)
        .then(handleResponse);
}



// ==================== ATTENDANCE MARKS CONFIG API FUNCTIONS ====================

/**
 * POST: Create Attendance Marks Config
 * /api/admin/attendance-marks-config
 */
function createAttendanceConfig(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderToPost(),
        body: JSON.stringify(data),
    };
    return fetch(`${AttendanceBaseUrl}`, requestOptions)
        .then(handleResponse);
}

function BulkAttendanceConfig(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderToPost(),
        body: JSON.stringify(data),
    };
    return fetch(`${AttendanceBaseUrl}/list`, requestOptions)
        .then(handleResponse);
}

/**
 * PUT: Update Attendance Marks Config
 * /api/admin/attendance-marks-config/{id}
 */
function updateAttendanceConfig(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeaderToPost(),
        body: JSON.stringify(data),
    };
    return fetch(`${AttendanceBaseUrl}/${id}`, requestOptions)
        .then(handleResponse);
}

/**
 * GET: Get All Attendance Configs By College
 * /api/admin/attendance-marks-config/college?collegeId={collegeId}
 */
function getAttendanceConfigsByCollege(collegeId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    return fetch(`${AttendanceBaseUrl}/college?collegeId=${collegeId}`, requestOptions)
        .then(handleResponse);
}

/**
 * DELETE: Delete Attendance Marks Config
 * /api/admin/attendance-marks-config/{id}
 */
function deleteAttendanceConfig(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
    };
    return fetch(`${AttendanceBaseUrl}/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) return Promise.reject("Delete failed");
            return true; // 204 No Content
        });
}

function osmEncryptedPost(data) {
    return fetch(`${ExamMGMAPI}/admin/osm-config`, {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(data)
    }).then(handleResponse);
}

function osmEncryptedGetByCollege(collegeId) {
    return fetch(`${ExamMGMAPI}/admin/osm-config/by-college/${collegeId}`, {
        method: "GET",
        headers: authHeader()
    }).then(handleResponse);
}

function osmEncryptedDelete(id) {
    return fetch(`${ExamMGMAPI}/admin/osm-config/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });
}

// ==================== MODERATION CONFIGURATION API FUNCTIONS ====================

/**
 * POST: Create Moderation Configuration
 * /api/admin/moderation-configuration
 */
function createModerationConfig(data) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderToPost(),
        body: JSON.stringify(data)
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration`,
        requestOptions
    ).then(handleResponse);
}

/**
 * PUT: Update Moderation Configuration
 * /api/admin/moderation-configuration/{id}
 */
function updateModerationConfig(id, data) {
    const requestOptions = {
        method: "PUT",
        headers: authHeaderToPost(),
        body: JSON.stringify(data)
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get Moderation By ID
 * /api/admin/moderation-configuration/{id}
 */
function getModerationConfigById(id) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Get All Moderations by Result Config
 * /api/admin/moderation-configuration/result-config/{resultConfigId}
 */
function getModerationsByResultConfig(resultConfigId) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration/result-config/${resultConfigId}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * POST: Toggle Moderation (Enable/Disable)
 * /api/admin/moderation-configuration/{id}/toggle?isModerationEnabled=true
 */
function toggleModeration(id, isEnabled) {
    const requestOptions = {
        method: "POST",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration/${id}/toggle?isModerationEnabled=${isEnabled}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * DELETE: Delete (Soft Delete)
 * /api/admin/moderation-configuration/{id}
 */
function deleteModerationConfig(id) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration/${id}`,
        requestOptions
    ).then(handleResponse);
}

/**
 * GET: Preview Moderation
 * /api/admin/moderation-configuration/{id}/preview?internalMarks=30&externalMarks=27
 */
function previewModeration(id, internalMarks, externalMarks) {
    const requestOptions = {
        method: "GET",
        headers: authHeader()
    };

    return fetch(
        `${ExamMGMAPI}/admin/moderation-configuration/${id}/preview?internalMarks=${internalMarks}&externalMarks=${externalMarks}`,
        requestOptions
    ).then(handleResponse);
}