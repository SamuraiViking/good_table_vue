<template>
  <div id="app">
    <button v-on:click="showDyanmicModel()">Dyanmic</button>
    <span v-if="year !== 2019">NOT CURRENT YEAR</span>
    <button v-on:click="getUserTermCourses()">My Courses</button>
    <button v-on:click="getTermCourses()">Term Courses</button>
    <div id="term-display">
      <div>
        <button v-on:click="changeSemester(-1)"> < </button>
        <h1>{{ year }} {{ this.semesterNumToName() }} </h1>
        <button v-on:click="changeSemester(1)"> > </button>
      </div>
    </div>
    <modal name="hello-world"
           :width="1000"
           :height="450"
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
    <modal name="filter-options"
      :width="600"
    >
      <div>
        <label>Department:</label>
        <multiselect v-model="value" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="text" track-by="value" :options="options" :multiple="true" @tag="addTag"></multiselect>
      </div>
      <button>Search</button>
    </modal>
    <button v-on:click="showFilterOptions">Advanced Show Options</button>
    <vue-good-table
      :fixed-header="true"
      max-height="600px"
      :columns="columns"
      :rows="rows"
      styleClass="vgt-table condensed bordered striped"
      :sort-options="{
        enabled: true,
      }"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'actions'">
          <button type="button" class="btn btn-primary" v-on:click="moreInfoModel(props)">View Details</button>
          <button type="button" class="btn btn-primary" v-on:click="addCourse(props)">Add Course</button>
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

console.log(departmentDropDownItems);
export default {
  components: {
    Multiselect
  },
  name: 'my-component',
  data() {
    return {
      value: [
        { text: 'All', value: 'All' }
      ],
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
            enabled: false,
          },
          type: 'number',
          tdClass: 'text-center',
        },
        {
          label: "GE's",
          field: 'gereqs',
          filterOptions: {
            enabled: false,
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
            enabled: false,
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
            enabled: false,
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
            enabled: false,
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
  },
  methods: {
    addTag(newTag) {
      const tag = {
        label: newTag,
        value: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      };
      console.log(tag);
      this.options.push(tag);
      this.value.push(tag);
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
    getTermCourses() {
      axios.get(`api/courses?term=${this.year}${this.semester}&type=class`).then(response => {
        this.rows = response.data.courses;
      });
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
      this.getTermCourses();
    },
    getUserTermCourses() {
      axios.get(`api/terms?term=${this.year}${this.semester}`).then(response => {
        this.rows = response.data[0].courses;
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
    addCourse(row) {
      axios.post(`api/course_terms?course_id=${row.id}&term_id=${this.userTerm.id}`).then(response => {
        this.getUserTermCourses();
      });
    },
    showDyanmicModel() {
      this.$modal.show({
        template: `
          <div>
            <h1>This is created inline</h1>
            <p>{{ text }}</p>
          </div>
        `,
        props: ['text']
      }, {
        text: 'This text is passed as a property'
      }, {
        height: '200px'
      }, {
        'before-close': (event) => { console.log('this will be called before the modal closes'); }
      })
    }
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
