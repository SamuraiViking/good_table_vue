<template>
  <div id="app">
    <span v-if="year !== 2019">NOT CURRENT YEAR</span>
    <div id="term-display">
      <div>
        <button v-on:click="changeSemester(-1)"> < </button>
        <h1>{{ year }} {{ this.semesterNumToName() }} </h1>
        <button v-on:click="changeSemester(1)"> > </button>
      </div>
    </div>
    <div style="display:flex">
      <form>
        <select v-model="selectedUserType" v-on:change="getCourses()">
          <option v-for="userType in userTypes">{{ userType }}</option>
        </select>
      </form>
      <form v-if="selectedUserType === 'Stolaf'">
        <select v-model="selectedCourseType" v-on:change="getCourses()">
          <option v-for="courseType in courseTypes" v-bind:value="courseType.value"> {{ courseType.text }}</option>
        </select>
      </form>
      <p v-if="selectedUserType==='My'">Courses</p>
    </div>
<!--     <button v-on:click="getUserTermCourses()">My Courses</button>
    <button v-on:click="getStOlafTermCourses()">Term Courses</button> -->
    <modal name="hello-world"
           :width="1000"
    >
      <div style="padding:30px">
        <h3>Prereqs</h3>
        {{ moreInfo.prereqs }}
        <h3>Description</h3>
        {{ moreInfo.description }}
        <h3>Notes</h3>
        {{ moreInfo.notes }}
      </div>
    </modal>
    <vue-good-table
      :fixed-header="true"
      :sort-options="{ enabled: true }"
      max-height="1000px"
      :columns="columns"
      :rows="rows"
      styleClass="vgt-table condensed bordered striped"
  >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'actions'">
          <button type="button" class="btn btn-primary" v-on:click="moreInfoModel(props)">View</button>
          <button type="button" class="btn btn-primary" v-on:click="addCourse(props)">Add</button>
          <button type="button" class="btn btn-primary" v-on:click="removeCourse(props)">Remove</button>
        </span>
        <span v-else> {{ props.formattedRow[props.column.field] }} </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import axios from "axios";
import departmentDropDownItems from "./components/DepartmentDropDownItems.js";
import Multiselect from 'vue-multiselect';

export default {
  components: {
    Multiselect
  },
  name: 'my-component',
  data() {
    return {
      userTypes: ['My', 'Stolaf'],
      selectedUserType: 'Stolaf',
      selectedCourseType: 'class',
      courseTypes: [
        { text: 'Classes', value: 'class'},
        { text: 'Labs', value: 'lab'},
        { text: 'Independent Studyies', value: 'IS'},
        { text: 'Independent Research', value: 'IR'},
        { text: 'Academent Internship', value: 'AI'},
      ],
      mySelectedRows: [],
      userTermId: '',
      options: departmentDropDownItems,
      courseTypeOptions: [
        'Class', 
        'Lab', 
        'Independent Research',
        'Independent Study',
        'Academic Internship'
      ],
      valueTypeValues: [
        'Class',
        'Lab',
        'IR',
        'IS',
        'AI'
      ],
      year: 2019,
      semester: 1,
      moreInfo: {
        'description': '',
        'prereqs': '',
        'notes': '',
      },
      columns: [
        {
          label: 'Status',
          field: 'status',
          filterOptions: {
            placeholder: 'All',
            enabled: false,
            filterDropdownItems: [
              {text: 'Open', value: 'O'},
              {text: 'Closed', value: 'C'}
            ]
          },
          tdClass: 'text-center',
          // tdClass: this.tdStatusClassFunc
        },
        {
          label: 'Name',
          field: 'name',
          filterOptions: {
            placeholder: 'filter name',
            enabled: true,
            filterDropdownItems: departmentDropDownItems
          }
        },
        {
          label: 'Department',
          field: 'department',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: departmentDropDownItems
          }
        },
        {
          label: 'Number',
          field: 'number',
          filterOptions: {
            enabled: true,
          },
          type: 'number',
          tdClass: 'text-center',
        },
        {
          label: "GE's",
          field: 'gereqs',
          filterOptions: {
            enabled: true,
            filterDropdownItems: [
              'WRI',
              'HWC'
            ]
          }
        },
        {
          label: 'Days',
          field: 'days',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: [
              {text: 'MWF', value: 'MWF'},
              {text: 'TTh', value: 'TTh'},
              {text: 'M-F', value: 'M-F'},
            ]
          }
        },
        {
          label: 'Times',
          field: 'times',
          filterOptions: {
            placeholder: 'All',
            enabled: true,
            filterDropdownItems: [
              {text: '', value: ''}
            ]
          }
        },
        // {
        //   label: 'Prof',
        //   field: 'prof',
        //   filterOptions: {
        //     placeholder: 'filter prof',
        //     enabled: falsee
        //   }
        // },
        // {
        //   label: 'Rating',
        //   field: 'rating',
        //   type: 'number',
        // },
        // {
        //   label: 'Difficulty',
        //   field: 'difficulty',
        //   type: 'number',
        // },
        // {
        //   label: 'Reviews',
        //   field: 'reviews',
        //   type: 'number',
        // },
        {
          label: 'Prereqs',
          field: this.prereqsFieldFn,
        },
        {
          label: 'Actions',
          field: 'actions',
          filterOptions: {
            enabled: true,
            filterDropdownItems: [
              'Class',
              'Independent Research',
              'Independent Study',
              'Academic Internship',
            ]       
          }
        },
      ],
      rows: [],
    };
  },
  created() {
    axios.get('api/courses?term=20191&type=class').then(response => {
      this.rows = response.data.courses;
    });
    axios.get('api/terms?term=20191').then(response => {
      this.userTermId = response.data[0].id
    })
  },
  methods: {
    getCourses() {
      this.selectedUserType === 'Stolaf' ? this.getStOlafTermCourses() : this.getUserTermCourses()
    },
    moreInfoModel(props) {
      this.moreInfo.description = props.row.description;
      this.moreInfo.prereqs = props.row.prerequisites;
      this.moreInfo.description = props.row.description;
      this.moreInfo.notes = props.row.notes;
      this.show();
    },
    show() {
      this.$modal.show('hello-world');
    },
    showFilterOptions() {
      this.$modal.show('filter-options');
    },
    hide() {
      this.$modal.hide('hello-world');
    },
    getStOlafTermCourses() {
      axios.get(`api/courses?term=${this.year}${this.semester}&type=${this.selectedCourseType}`).then(response => {
        this.rows = response.data.courses;
      });
      console.log(this.selectedCourseType)
    },
    changeSemester(change) {
      if (this.semester + change > 5 && this.year < 2022) {
        this.year += 1;
        this.semester = 1;
      } else if (this.semester + change < 1 && this.year > 2015) {
        this.year -= 1;
        this.semester = 5;
      } else if (this.semester + change <= 5 && this.semester + change >= 1) {
        this.semester += change;
      }
      this.getStOlafTermCourses();
    },
    getUserTermCourses() {
      console.log('hello')
      axios.get(`api/terms?term=${this.year}${this.semester}`).then(response => {
        this.rows = response.data[0].courses;
        this.userTermId = response.data[0].id
      });
    },
    semesterNumToName() {
      var semesterName = '';
      switch (this.semester) {
      case 1:
        semesterName = 'Fall';
        break;
      case 2:
        semesterName = 'Interim';
        break;
      case 3:
        semesterName = 'Spring';
        break;
      case 4:
        semesterName = 'Summer session 1';
        break;
      case 5:
        semesterName = 'Summer session 2';
        break;
      default:
        semesterName = 'Unknown';
        break;
      }
      return semesterName;
    },
    prereqsFieldFn(rowObj) {
      return rowObj.prerequisites === 'f' ? 'no' : 'yes';
    },
    tdStatusClassFunc(row) {
      return row.status === 'C' ? 'red-class' : 'green-class';
    },
    addCourse(props) {
      axios.post(`api/course_terms?course_id=${props.row.id}&term_id=${this.userTermId}`)
    },
    removeCourse(props) {
      axios.delete(`api/course_terms/${this.userTermId}/${props.row.id}`).then(response => {
        this.getUserTermCourses();
      });
    },
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

.text-center {
  text-align: center;
}

.red-class {
  background: red;
  color: red;
}

.green-class {
  background: #38CD3D;
  color: green;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#term-display {
  display: flex;
  /*background: blue;*/
  text-align: center;
}

#term-display div {
  display: flex;
  margin: 0px auto;
}

#term-dislay div button {
}
</style>
