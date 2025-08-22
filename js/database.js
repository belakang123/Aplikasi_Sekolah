// js/database.js

/**
 * Utility function to safely parse JSON from localStorage.
 * Prevents errors if the stored string is null, undefined, or invalid JSON.
 * @param {string | null} jsonString - The string retrieved from localStorage.
 * @param {any} defaultValue - The value to return if parsing fails or string is empty.
 * @returns {any} The parsed object or the default value.
 */
function safeParseJSON(jsonString, defaultValue) {
    try {
        return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (e) {
        console.error("Error parsing JSON from localStorage:", e);
        return defaultValue;
    }
}

// --- Default Data Structures ---

// Default students data
const defaultStudents = [
    { id: 1, name: 'Budi Santoso', class: '1A', nisn: '001', address: 'Jl. Merdeka No. 1' },
    { id: 2, name: 'Siti Aminah', class: '1A', nisn: '002', address: 'Jl. Pahlawan No. 5' },
    { id: 3, name: 'Joko Susilo', class: '1B', nisn: '003', address: 'Jl. Raya No. 10' },
    { id: 4, name: 'Dewi Lestari', class: '1B', nisn: '004', address: 'Jl. Damai No. 15' },
    { id: 5, name: 'Ahmad Fauzi', class: '2A', nisn: '005', address: 'Jl. Pendidikan No. 20' },
    { id: 6, name: 'Nurul Huda', class: '2A', nisn: '006', address: 'Jl. Cendana No. 25' },
    { id: 7, name: 'Rina Fitriani', class: '2B', nisn: '007', address: 'Jl. Anggrek No. 30' },
    { id: 8, name: 'Eko Prasetyo', class: '2B', nisn: '008', address: 'Jl. Mawar No. 35' },
];

// Default schedule data (empty array)
const defaultSchedule = [];

// Default attendance data (empty object, structured by month -> studentId -> day)
const defaultAttendance = {};

// Default hafalan data (empty object, structured by month -> studentId -> day)
const defaultHafalan = {};

// Default grades data (empty object, structured by studentId_semester)
const defaultGrades = {};

// --- Data Management Functions ---

/**
 * Manages Student Data in localStorage.
 */
export const studentDB = {
    key: 'studentsApp',
    load: () => safeParseJSON(localStorage.getItem(studentDB.key), defaultStudents),
    save: (data) => localStorage.setItem(studentDB.key, JSON.stringify(data)),
    add: (newStudent) => {
        const students = studentDB.load();
        students.push(newStudent);
        studentDB.save(students);
    },
    update: (updatedStudent) => {
        let students = studentDB.load();
        const index = students.findIndex(s => s.id === updatedStudent.id);
        if (index !== -1) {
            students[index] = updatedStudent;
            studentDB.save(students);
        }
    },
    delete: (id) => {
        let students = studentDB.load();
        students = students.filter(s => s.id !== id);
        studentDB.save(students);
    },
    getById: (id) => {
        const students = studentDB.load();
        return students.find(s => s.id === id);
    },
    getAll: () => studentDB.load(),
    getUniqueClasses: () => {
        const students = studentDB.load();
        return [...new Set(students.map(s => s.class))].sort();
    }
};

/**
 * Manages Schedule Data in localStorage.
 */
export const scheduleDB = {
    key: 'scheduleApp',
    load: () => safeParseJSON(localStorage.getItem(scheduleDB.key), defaultSchedule),
    save: (data) => localStorage.setItem(scheduleDB.key, JSON.stringify(data)),
    add: (newItem) => {
        const schedule = scheduleDB.load();
        schedule.push(newItem);
        scheduleDB.save(schedule);
    },
    delete: (day, time, className) => {
        let schedule = scheduleDB.load();
        schedule = schedule.filter(item => 
            !(item.day === day && item.time === time && item.class === className)
        );
        scheduleDB.save(schedule);
    },
    getAll: () => scheduleDB.load(),
    // --- Tambahkan metode ini ---
    getScheduleByClass: (className) => {
        const allSchedules = scheduleDB.load();
        return allSchedules.filter(schedule => schedule.class === className);
    }
    // --------------------------
};

/**
 * Manages Attendance Data in localStorage.
 */
export const attendanceDB = {
    key: 'attendanceApp',
    load: () => safeParseJSON(localStorage.getItem(attendanceDB.key), defaultAttendance),
    save: (data) => localStorage.setItem(attendanceDB.key, JSON.stringify(data)),
    // Specific methods for attendance can be added here if needed
    // e.g., updateStatus(month, studentId, day, status)
};

/**
 * Manages Hafalan Data in localStorage.
 */
export const hafalanDB = {
    key: 'hafalanApp',
    load: () => safeParseJSON(localStorage.getItem(hafalanDB.key), defaultHafalan),
    save: (data) => localStorage.setItem(hafalanDB.key, JSON.stringify(data)),
    // Specific methods for hafalan can be added here if needed
    // e.g., updateHafalan(month, studentId, day, type, value)
};

/**
 * Manages Grades Data in localStorage.
 */
export const gradesDB = {
    key: 'gradesApp',
    load: () => safeParseJSON(localStorage.getItem(gradesDB.key), defaultGrades),
    save: (data) => localStorage.setItem(gradesDB.key, JSON.stringify(data)),
    // Specific methods for grades can be added here if needed
    // e.g., updateGrade(studentId, semester, subject, score)
};

// Helper for day names (can be moved to a separate utils file if preferred)
export const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_NAMES_ID = {
    'Sunday': 'Minggu',
    'Monday': 'Senin',
    'Tuesday': 'Selasa',
    'Wednesday': 'Rabu',
    'Thursday': 'Kamis',
    'Friday': 'Jumat',
    'Saturday': 'Sabtu'
};
