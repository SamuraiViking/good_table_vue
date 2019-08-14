<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="rows"/>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'my-component',
  data() {
    return {
      columns: [
        {
          label: 'Status',
          field: 'status',
        },
        {
          label: 'Name',
          field: 'name'
        },
        {
          label: 'Department',
          field: 'department'
        },
        {
          label: 'Number',
          field: 'number'
        },
        {
          label: 'Section',
          field: 'section'
        },
        {
          label: 'Times',
          field: 'times'
        }
      ],
      rows: [],
    };
  },
  created() {
    axios.get('api/courses?term=20191&type=class').then(response => {
      this.rows = response.data.courses;
    });
  }
};
</script>