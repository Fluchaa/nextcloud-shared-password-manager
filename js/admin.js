/**
 * @copyright Copyright (c) 2018 niTEC GesbR https://nitec.at
 * @author Michael Flucher <michael.flucher@nitec.at>
 *
 * Permission is hereby granted to 
 *
 * all our Customers
 *
 * obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge or publish this Software. 
 *
 * Noone is permitted to use or sell parts of the Software or the whole Software 
 * without the written permission of niTEC GesbR. 
 */

var Groups = function(baseUrl) {
	this._baseUrl = baseUrl;
	this._groups = [];
};

Groups.prototype = {
	load: function() {
		var deferred = $.Deferred();
		var self = this;
		$.ajax({
			url: this._baseUrl,
			method: 'GET',
			async: false
		}).done(function(groups) {
			self._groups = groups;
			self.fillTable(self);
		}).fail(function() {
			deferred.reject();
		});
		return deferred.promise();
	},
	addGroup: function(name) {
		var self = this;
		$.ajax({
			url: this._baseUrl + '/' + name,
			method: 'POST'
		}).done(function(response) {
			if(response.type === "success") {
				self.appendGroup(response.group, self);
			}
			self.showMessage(response.message, response.type);
		}).fail(function(response) {
			self.showMessage('Internal Server Error', 'error');
		});
	},
	appendGroup: function(group, self) {
		if(self === undefined) {
			self = this;
		}

		self._groups.push(group);
		self.fillTable();
	},
	fillTable: function(self) {
		if(self === undefined) {
			self = this;
		}

		$('#groups_table tbody').html('');

		if(self._groups.length == 0) {
			($('#groups_table tbody')).append(
				'<tr><td>Please add a group</td><td></td></tr>'
			);
		} else {
			for(var i = 0; i < self._groups.length; i++) {
				var group = self._groups[i];
				($('#groups_table tbody')).append(
					'<tr><td>' + group.name + '</td><td><button class="spwm_group_edit_button" data-group-id="' + group.group_id +'">Edit</button></td></tr>'
				);
			}
		}
	}
};

var Users = function(baseUrl) {
	this._baseUrl = baseUrl;
	this._users = [];
	this._offset = 0;
	this._page = 1;
};

Users.prototype = {
	load: function() {
		var deferred = $.Deferred();
		var self = this;
		$.ajax({
			url: this._baseUrl,
			method: 'GET',
			async: false
		}).done(function(users) {
			self._users = users;
			self.fillTable(1, self);
		}).fail(function() {
			deferred.reject();
		});
		return deferred.promise();
	},
	addUser: function(userId, password) {
		var self = this;
		$.ajax({
			url: this._baseUrl + '/' + userId,
			method: 'POST',
			data: {password: password}
		}).done(function(response) {
			if(response.type === "success") {
				self.appendUser(response.user, self);
			} 
			self.showMessage(response.message, response.type);
		}).fail(function(response) {
			self.showMessage('Internal Server Error', 'error');
		});
	},
	appendUser: function(user, self) {
		if(self === undefined) {
			self = this;
		}
		self._users.push(user);
		self.fillTable(self._page);
	},
	getUserWithId: function(userId) {
		for(var i = 0; i < this._users.length; i++) {
			if(this._users[i].user_id === userId) {
				return this._users[i];
			}
		}
	},
	fillTable: function(page, self) {
		if(self === undefined) {
			self = this;
		}
		page -= 1;
		page *= 5;

		$('#users_table tbody').html('');

		if(self._users.length == 0) {
			($('#users_table tbody')).append(
				'<tr><td></td><td>Please add the admin user first</td><td></td></tr>'
			);
		} else {
			for(var i = page; (i < self._users.length && i < page+5); i++) {
				var user = self._users[i];
				($('#users_table tbody')).append(
					'<tr><td>' + user.user_id + '</td><td>' + user.username + '</td><td>' + 
					(user.admin?'':'<button class="spwm_user_edit_button">Edit</button>') + '</td></tr>'
				);
			}

			if(page == 0) {
				self.createPagination();
			} else {
				self.updatePagination(page);
			}

			$('#groups-link').show();
		}
	},
	createPagination: function() {
		$('#user_table_pagination ul').html('');

		for(var i = 1; i < Math.floor(this._users.length/5) + 1; i++) {
			if(i == 1) {
				($('#user_table_pagination ul')).append(
					'<li cass="active">' + i + '</li>'
				);
			} else {
				($('#user_table_pagination ul')).append(
					'<li class="pagenumber">' + i + '</li>'
				);
			}
		}

		if(Math.floor(this._users.length/5) + 1 > 1) {
			($('#user_table_pagination ul')).append(
				'<li id="pagination_right"><i class="fas fa-chevron-right"></i></li>'
			);
		}
	},
	updatePagination: function(page) {
		$('#user_table_pagination ul').html('');

		if(page > 1) {
			($('#user_table_pagination ul')).append(
				'<li id="pagination_left"><i class="fas fa-chevron-left"></i></li>'
			);
		}

		for(var i = 1; i < Math.floor(this._users.length/5) + 1; i++) {
			if(i == page) {
				($('#user_table_pagination ul')).append(
					'<li cass="active">' + i + '</li>'
				);
			} else {
				($('#user_table_pagination ul')).append(
					'<li class="pagenumber">' + i + '</li>'
				);
			}
		}

		if(Math.floor(this._users.length/5) + 1 > page) {
			($('#user_table_pagination ul')).append(
				'<li id="pagination_right"><i class="fas fa-chevron-right"></i></li>'
			);
		}
	},
	loadEditUser: function(user) {
		$('#spwm-tabs #edit-user').html('');
		($('#spwm-tabs #edit-user')).append(
			'<h3>Editing ' + user.username + '</h3>'
		);

		this.getGroupsOfUser(user.user_id);
	},
	getGroupsOfUser: function(userId) {
		var deferred = $.Deferred();
		var self = this;
		$.ajax({
			url: this._baseUrl + '/' + userId + '/groups',
			method: 'GET',
			async: false
		}).done(function(groups) {
			for(var i = 0; i < groups.length; i++) {
				group = groups[i];
				($('#spwm-tabs #edit-user')).append(
					'<input type="checkbox" ' + (group.checked?'checked="checked" ':'') +
					'id="' + group.group_id +'" class="checkbox"><label for="' + group.group_id + '">' +
					group.name + '</label><br />'
				);
			}
		}).fail(function() {
			deferred.reject();
		});
		return deferred.promise();
	},
	showMessage: function(txt, type) {
		$('#spwm-alert').removeClass('error success');
		$('#spwm-alert').text(txt);
		setTimeout(function(){
			$('#spwm-alert').addClass(type);
		}, 200);
	}
};

var Categories = function(baseUrl) {
	this._baseUrl = baseUrl;
	this._categories = [];
};

Categories.prototype = {
	load: function() {
		var deferred = $.Deferred();
		var self = this;
		$.ajax({
			url: this._baseUrl,
			method: 'GET',
			async: false
		}).done(function(categories) {
			self._categories = categories;
			self.fillTable(self);
		}).fail(function() {
			deferred.reject();
		});
		return deferred.promise();
	},
	addCategory: function(name) {
		var self = this;
		$.ajax({
			url: this._baseUrl + '/' + name,
			method: 'POST'
		}).done(function(response) {
			if(response.type === "success") {
				self.appendCategory(response.category, self);
			}
			self.showMessage(response.message, response.type);
		}).fail(function(response) {
			self.showMessage('Internal Server Error', 'error');
		});
	},
	appendCategory: function(category, self) {
		if(self === undefined) {
			self = this;
		}

		self._categories.push(category);
		self.fillTable();
	},
	fillTable: function(self) {
		if(self === undefined) {
			self = this;
		}

		$('#categories_table tbody').html('');

		if(self._categories.length == 0) {
			($('#categories_table tbody')).append(
				'<tr><td>Please add a category</td><td></td></tr>'
			);
		} else {
			for(var i = 0; i < self._categories.length; i++) {
				var category = self._categories[i];
				($('#categories_table tbody')).append(
					'<tr><td>' + category.name + '</td><td><button class="spwm_category_edit_button" data-category-id="' + category.category_id +'">Edit</button></td></tr>'
				);
			}
		}
	},
	showMessage: function(txt, type) {
		$('#spwm-alert').removeClass('error success');
		$('#spwm-alert').text(txt);
		setTimeout(function(){
			$('#spwm-alert').addClass(type);
		}, 200);
	}
};

$(document).ready(function() {
	// get users
	var users = new Users(OC.generateUrl('apps/spwm/admin/users'));
	users.load();
	// get groups
	var groups = new Groups(OC.generateUrl('apps/spwm/admin/groups'));
	groups.load();
	// get categories
	var categories = new Categories(OC.generateUrl('apps/spwm/admin/categories'));
	categories.load();

	// users pagination buttons
	$(document).on('click', '#user_table_pagination #pagination_right', function() {
		users._page += 1;
		users.fillTable(users._page);
	});
	$(document).on('click', '#user_table_pagination #pagination_left', function() {
		users._page -= 1;
		users.fillTable(users._page);
	});
	$(document).on('click', '#user_table_pagination .pagenumber', function() {
		users._page = parseInt($(this).text());
		users.fillTable(users._page);
	});

	// getting userid with displayname
	$('#spwm_add_username').autocomplete({
		source: OC.generateUrl('apps/spwm/admin/users/search'),
		minLength: 1
	});

	// add user
	$('#spwm_add_user_button').click(function() {
		users.addUser($('#spwm_add_username').val(), $('#spwm_add_password').val());
	});

	// edit user
	$(document).on('click', '.spwm_user_edit_button', function() {
		var user = users.getUserWithId($(this).parent().siblings(':first').text());
		users.loadEditUser(user);
		$('#spwm-tabs').tabs('option', 'active', 1);
	});

	// add group
	$('#spwm_add_group_button').click(function() {
		groups.addGroup($('#spwm_add_group').val());
	});

	// add category
	$('#spwm_add_category_button').click(function() {
		categories.addCategory($('#spwm_add_category').val());
	});

	$('#spwm-tabs').tabs();
});