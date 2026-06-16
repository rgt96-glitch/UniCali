export default {
  name: 'wall',
  title: 'Wall',
  type: 'document',
  fields: [
    { name:'title',       title:'Title',       type:'string',  validation: R => R.required() },
    { name:'location',    title:'Location',    type:'string'  },
    { name:'year',        title:'Year',        type:'string'  },
    { name:'description', title:'Description', type:'text'    },
    { name:'image',       title:'Image',       type:'image',  options:{hotspot:true} },
  ]
}