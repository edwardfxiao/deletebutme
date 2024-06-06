# deletebutme

Delete everything except for specific files (in this case, please keep `index_a.js` and `index_a.css`).

Of course, you can also use `--inverse 1` to only remove them instead.



```sh
npm install deletebutme -g
```

```
The folder needs to perfom the deletion

│   index_a.js
│   index_b.js
│   index_a.css
│   a.png
│   b.png
│   c.png
│   d.png
```

```txt
// items_need_to_stay.txt

index_a.js
index_a.css
```

```sh
~$ deletebutme delete --deleteDir /path_to_the_deletion_folder  --filterFileDir /path_to_the_items_need_to_stay.txt
```

```
Result
│
│   index_a.js
│   index_a.css
```

```js
const DEFAULT_OPTIONS = {
  nofile: false, // check https://github.com/manidlou/node-klaw-sync for more info
  nodir: true, // check https://github.com/manidlou/node-klaw-sync for more info
  depthLimit: -1, // check https://github.com/manidlou/node-klaw-sync for more info
  basename: false,
  inverse: false,
  deleteDir: '',
  filterFileDir: '',
  extGoes: '[]', // '[".js", ".css", ".html"]'
  extStays: '[]',  // '[".jpg", ".png", ".svg"]'
};
```

```sh
~$ deletebutme delete --nofile 0 --nodir 0 --extGoes '[".js", ".css", ".html"]'
```
