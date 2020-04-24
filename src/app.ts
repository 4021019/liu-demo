import { getDvaApp } from 'umi';
import React from 'react';

document
  .getElementsByTagName('body')[0]
  .addEventListener('keydown', function(e) {
    if (e.metaKey && e.keyCode === 83) {
      console.log(getDvaApp());
    }
  });
