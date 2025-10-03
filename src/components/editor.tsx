'use client'

import React from 'react'
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const Editor = () => {

    const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| ddjkj| dsadmda |
`
  return (
    <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
  );
};

export default Editor;