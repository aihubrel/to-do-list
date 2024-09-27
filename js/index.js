var filterResults = function () {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    getTasks();
  }
  var returnActiveTasks;
  var returnCompletedTasks;
  var numActive = 0;
  var numCompleted = 0;
  
  var getTasks = function() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1312',
      dataType: "json",
      success: function (response, textStatus) {
        $('.todo-list').empty();
        returnActiveTasks = response.tasks.filter(function (task) {
          if (!task.completed) {
            return task.id;
          }
        });
        returnCompletedTasks = response.tasks.filter(function (task) {
          if (task.completed) {
            return task.id;
          }
        });
  
        var filter = $('.active').attr('id');
  
        if (filter === 'all' || filter === '') {
          taskItems = response.tasks;
        }
        if (filter === 'active') {
          taskItems = returnActiveTasks;
        }
        if (filter === 'completed') {
          taskItems = returnCompletedTasks;
        }
  
        var sortedItems = taskItems.sort(function (a, b) {
          return Date.parse(a.created_at) - Date.parse(b.created_at);
        });
  
        sortedItems.forEach(function (task) {
          var taskContent = `
            <div class="to-do">
            <div class="row"><p class="col-xs-8"> ${task.content} 
            <br>Due: ${task.due}</p>
            <button class="delete" data-id="${task.id}">x</button>
            <input type="checkbox" id ="${task.id}" class="select" data-id="${task.id}"(task.completed ? 'checked' : '') + '>
          `;
          $('.todo-list').append(taskContent);
        })
        
        // update the amount of task items
        $('.to-do-amount span').text(returnActiveTasks.length);
        numCompleted = returnCompletedTasks.length;
        $('.completed-amount span').text(numCompleted);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var submitTask = function () {
    var taskInput = $('.create-task input'); 
    var dueDate = Date($('#due-date').val());
    
    $.ajax({
      
      type: "POST",
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1312',
      contentType: 'application/json',
      data: JSON.stringify({
        task: {
          content: taskInput.val(),
          due:dueDate,
        }
      }),
      dataType: "json",
      success: function (response, textStatus) {
        console.log(response);
        getTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
    taskInput.val('');  
  };
  
  var deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=1312',
      success: function (response, textStatus) {
        console.log(response);
        getTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };
  
  var taskIsComplete = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=1312',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        getTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    }); 
  } 
  
  var taskIsActive = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=1312',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        getTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    }); 
  }
  
  $(document).ready(function () {
  
    getTasks();
  
    $('.create-task').on('submit', function (event) {
      event.preventDefault();
      submitTask();
    });
  
    $(document).on('click', '.delete', function () {
      deleteTask($(this).data('id'));
    });
    
    $(document).on('click', '.select', function () {
      if ($(this).data('completed')) {
        taskIsActive($(this).data('id'));
      } else {
      } taskIsComplete($(this).data('id'));
    });
  
    // filtering
    $('.to-do-filter button').on('click', filterResults);
  
  });