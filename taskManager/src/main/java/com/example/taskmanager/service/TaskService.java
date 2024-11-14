package com.example.taskmanager.service;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {

        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Tarea no encontrada con id " + id));

        if (taskDetails.getDescription() != null) {
            task.setDescription(taskDetails.getDescription());
        }
        task.setCompleted(taskDetails.isCompleted());
        task.setDueDate(taskDetails.getDueDate());
        task.setPriority(taskDetails.getPriority());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}

