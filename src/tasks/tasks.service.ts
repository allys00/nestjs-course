import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const taskFounded = await this.tasksRepository.findOne(id);

    if (!taskFounded) {
      throw new NotFoundException(`The task with the id ${id} was not founded`);
    }

    return taskFounded;
  }

  async deleteTaskById(id: string): Promise<void> {
    const { affected } = await this.tasksRepository.delete(id);
    if (!affected) throw new NotFoundException(`Task with ID ${id} Not Found`);
  }

  async updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {
    const task: Task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
