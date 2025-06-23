import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { newCourse, SCourse } from '../shared/interfaces/courses';
import { NgForOf } from '@angular/common';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    NgForOf,
    Button,
    Dialog,
    InputText,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  cols: Column[] = [];

  addModalVisible = false;
  editModalVisible = false;
  deleteModalVisible = false;

  selectedCourse: newCourse | null = null;
  newCourse: newCourse = { id: '', courseID: '', name: '' };
  editedCourse: newCourse = { id: '', courseID: '', name: '' };

  // Signal accessor for the courses
  courses = SCourse;

  ngOnInit() {
    this.cols = [
      { field: 'courseID', header: 'Kurs Bezeichnung' },
      { field: 'name', header: 'Vorlesung' },
    ];
  }

  showCourse(course: newCourse) {
    console.log('Show:', course);
  }

  openAddModal() {
    this.newCourse = { id: this.generateId(), courseID: '', name: '' };
    this.addModalVisible = true;
  }

  addCourse() {
    SCourse.update(current => [...current, this.newCourse]);
    this.addModalVisible = false;
  }

  openEditModal(course: newCourse) {
    this.editedCourse = { ...course };
    this.editModalVisible = true;
  }

  updateCourse() {
    SCourse.update(current =>
      current.map(c => (c.id === this.editedCourse.id ? this.editedCourse : c))
    );
    this.editModalVisible = false;
  }

  openDeleteModal(course: newCourse) {
    this.selectedCourse = course;
    this.deleteModalVisible = true;
  }

  deleteCourse() {
    if (!this.selectedCourse) return;
    SCourse.update(current =>
      current.filter(c => c.id !== this.selectedCourse!.id)
    );
    this.deleteModalVisible = false;
    this.selectedCourse = null;
  }

  generateId(): string {
    return Date.now().toString();
  }
}
