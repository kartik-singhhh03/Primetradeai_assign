const prisma = require("../config/prisma");

const createTask = async (userId, { title, description }) => {
  return prisma.task.create({
    data: { title, description, userId },
  });
};

const getAllTasks = async (userId, role) => {
  const where = role === "ADMIN" ? {} : { userId };
  return prisma.task.findMany({ where, orderBy: { createdAt: "desc" } });
};

const getTaskById = async (taskId, userId, role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }

  if (role !== "ADMIN" && task.userId !== userId) {
    const err = new Error("Forbidden. You do not have access to this task.");
    err.statusCode = 403;
    throw err;
  }

  return task;
};

const updateTask = async (
  taskId,
  userId,
  role,
  { title, description, completed },
) => {
  await getTaskById(taskId, userId, role); // ownership check

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
    },
  });
};

const deleteTask = async (taskId, userId, role) => {
  await getTaskById(taskId, userId, role); // ownership check

  return prisma.task.delete({ where: { id: taskId } });
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
