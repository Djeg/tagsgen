TagsGen
=======

Configurable ctags generator based on node watch.

## Installation

```
$ npm install tagsgen -g
```

## Usage

```
$ tagsgen [folder]
```

This command will generate your ctags in the current folder and watch for all
the files changement and regenerate your tags.

## Configuration

You can create a `.tagsgen.json` in plural places in order to customize the tags
generation process:

- In your home folder
- In the current folder watched by tagsgen

This is a complete reference for the `.tagsgen.json` file:

```javascript
{
    "my-js-tags": {
        // A non required path that tagsgen will watch
        "path": "lib",
        // A file extension to watch
        "extension": "js",
        // The destination tags file
        "file": "my-js-tags.tags",
        // Custom arguments sent to the ctags command
        "args": [
            "--tag-relative"
        ]
    }
}
```
