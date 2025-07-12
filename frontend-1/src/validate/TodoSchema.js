import * as yup from "yup";

const todoSchema = {
  todoList: yup.object({
    to_title: yup.string().required("title is required"),
  }),
  todoListDetail: yup.object({
    td_title: yup.string().required("title is required"),
    td_descript: yup.string().required("descript is required"),
    td_completed: yup.boolean().required("status is required"),
    to_id: yup.string().required("to_id is required"),
  }),
  editTodoListDetail: yup.object({
    td_title: yup.string().required("title is required"),
    td_descript: yup.string().required("descript is required"),
    td_completed: yup.boolean().required("status is required"),
  }),
};

export default todoSchema;
