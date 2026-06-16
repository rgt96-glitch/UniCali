export default {
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    { name:'title',       title:'Title',       type:'string',  validation: R => R.required() },
    { name:'medium',      title:'Medium',      type:'string'  },
    { name:'year',        title:'Year',        type:'string'  },
    { name:'size',        title:'Size',        type:'string'  },
    { name:'price',       title:'Price',       type:'string'  },
    { name:'description', title:'Description', type:'text'    },
    { name:'aspect',      title:'Aspect ratio', type:'string', options:{ list:['tall','wide','square'] } },
    { name:'tags',        title:'Tags',        type:'array',  of:[{type:'string'}] },
    { name:'image',       title:'Image',       type:'image',  options:{hotspot:true} },
  ]
}