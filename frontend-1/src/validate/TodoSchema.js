import * as yup from "yup";

const todoSchema = {
  // Schema สำหรับฟอร์มสร้าง/แก้ไข Todolist หลัก
  todoList: yup.object({
    title: yup.string().trim().required("กรุณากรอกหัวข้อ"),
  }),

  // Schema สำหรับฟอร์มสร้าง/แก้ไข Todolist Detail
  todoListDetail: yup.object({
    title: yup.string().trim().required("กรุณากรอกหัวข้อรายละเอียด"),
    description: yup.string(), // ไม่บังคับ
    completed: yup.boolean(),   // ไม่บังคับ
  }),
};

export default todoSchema;