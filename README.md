# deletebutme

Delete anything but something(In this case, just stay `index_a.js`, `index_a.css` please).

```sh
npm install deletebutme -g
```

```txt
// path_to_filter_file
index_a.js
index_a.css
```

```
The folder needs to delete
│
│   index_a.js
│   index_b.js
│   index_a.css
│   a.png
│   b.png
│   c.png
│   d.png
```

```sh
deletebutme delete --deleteDir /path_to_folder  --filterFileDir /path_to_filter_file
```

```
The folder needs to delete
│
│   index_a.js
│   index_a.css
```