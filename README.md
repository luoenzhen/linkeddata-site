# TERN Linked Data Services Website source code.

>
 Live at https://linkeddata.tern.org.au.

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

The `main` branch on the remote repository is protected. All modifications must be performed on a separate branch and merged in via GitHub pull requests.

Tests and builds are automatically performed on each pull request event ("open" and "synchronisation").

Pull requests automatically build and deploy a preview version of the website to surge.sh. A bot will provide a link in the pull request's comment to the preview version.

A merge into the `main` branch automatically creates a containerised development version of the website. TERN's Flux will automatically deploy development versions to https://linkeddata-test.tern.org.au.

A production version is automatically triggered when a GitHub release is made. TERN's [Flux](https://fluxcd.io/) will automatically deploy production versions to https://linkeddata.tern.org.au.

For more details on how the GitHub Actions workflows are set up, see [.github/workflows](.github/workflows).

## Development

### Recommended tools for development

Use Visual Studio Code for editing the source code in a development container.

### Installation

```
$ npm
```

### Local Development

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Running tests

```
npm test
```

You can use ES6 module imports in your tests. We have set this up following the unmarked answer from https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export#answer-59718259.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

It is useful to run this command to check if builds succeed correctly. Docusaurus will also check for broken links referencing within the website as well.

### Diagrams

We use [diagrams.net](https://www.diagrams.net/) to draw our diagrams and Google Drive to save the diagrams.

The RLP protocol diagrams are saved at this location https://drive.google.com/drive/u/1/folders/1Fh2yoAI_Yvnz8wiuJRqW5_NGU5Uw8llf.

Diagrams are saved in Google Drive and then embedded into linkeddata-site using an iframe. Here are the instructions on adding a diagram to a page.

In diagrams.net, open the diagram that you would like to embed. On the top-left, go to `File -> Embed -> IFrame...`. Change the `Edit -> Make a Copy` to `Edit -> Custom...`. Click ok on the next prompt and then click `Create`. Copy the iframe html snippet into the web page.

Example:

```html
<iframe
  frameborder="0"
  style="width:100%;height:593px;"
  src="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=https%3A%2F%2Fapp.diagrams.net%2F%23G1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL&layers=1&nav=1&title=basal-area-full-lite-example#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL%26export%3Ddownload"
></iframe>
```

Note that if you're working in an MDX file (files with `.md` extension but are processed using MDX), you will need to convert the attributes to a compatible JSX syntax.

Example:

```html
<iframe frameBorder="0" style={{width:"100%",height:"593px"}} src="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=https%3A%2F%2Fapp.diagrams.net%2F%23G1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL&layers=1&nav=1&title=basal-area-full-lite-example#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL%26export%3Ddownload"></iframe>
```

Notice the attribute `frameBorder` and the values for `style` are different.

To improve the user-experience for users reading the diagrams, it may be useful to add an additional link after the diagram that takes the user to a new tab that opens the diagram in full screen. To do this, simply add an `a` element after the iframe element. Set the `a` element's `href` attribute's value to the same value as the `src` of the iframe. Set the `target` attribute of the `a` element with the value `_blank`.

```html
<a
  target="_blank"
  href="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=https%3A%2F%2Fapp.diagrams.net%2F%23G1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL&layers=1&nav=1&title=basal-area-full-lite-example#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL%26export%3Ddownload"
  >View diagram in new tab.</a
>
```

The end result should look something like this:

![img](https://i.imgur.com/wphh236.png)

<a target="_blank" href="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=https%3A%2F%2Fapp.diagrams.net%2F%23G1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL&layers=1&nav=1&title=basal-area-full-lite-example#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1ehO_1Lxzj0v6gWat6tq_36QVzOzXC7iL%26export%3Ddownload">View diagram in new tab.</a>

## Contact

Edmond Chuc  
e.chuc@uq.edu.au
