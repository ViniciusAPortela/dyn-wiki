# Documentation

Summary:
- [Contributing with Articles](#contribule_articles)
	- [File Structure](#file_structure)
	- [Article Configuration](#article_configuration)
- [Contributing with DynWiki Engine](#contribule_engine)

## Contribute with Article <a id='contribule_articles'/>

To start contributing with article to DynWiki project you first need to understand how the engine reads your article to use all potential of the engine.

### File Structure<a id='file_structure'/>
First of all, the **File Structure**, there are basic 3 important things to understand:
**1** - Each article has it's unique ID
The unique ID is used ( *obviously* ) to identificate a article, the ID is a number from **1 to the infinite**, in practice, this number will be gived to you, so don't worry about it.

**2** - Articles are separated in versions 
This exists to prevent outdated articles or making duplicated articles saying the same thing but updating just a small thing. The versioning also exists to people who uses outdated versions *( for example, of a program )* still having acess to the old article.

**3** - Each article version has your languages
As each version can have modification on it's content and instructions ( *not just code* ), each version have to has it's translations ( *probably it'll not change a lot from one version to other, so you can actually just copy the translation from the last article* ).

The result will be something like this:

![File Structure](https://github.com/vinicius-portela/dyn-wiki/blob/master/docs/images/file_structure.png)

In practice, if you want to create a article just worry to put it in a folder named **1** ( *the article version, in this case the first version* ) with the article language as a suffix ( *if in english (en), then article.en.md* )

articles/*Your_Article_ID*/**1**/article.**en**.md

To insert **images** and **files**, it can be inserted in article root folder with the name images and files respectively

articles/*Your_Article_ID*/**images**/

articles/*Your_Article_ID*/**files**/

To **acess images** and **files**, see [images](#) and [files](#)

### Article Configuration<a id='article_configuration'/>

Now you understand where to insert your file, let's start editing it. Let's understand the Articles Configurations and how to use it.

Each Article ( *made in Markdown* ) have your configuration at the top of article ( *for convention, but it can be placed pratically at any position* ).

The configuration are used to DynWiki Engine know the title, the description, the article language, and other informations.

To add a configuration simply put **#!** with the configuration key and it's value:

```md
#!title: How to Update Linux Kernel
```
For the current version (0.2.0), the available configurations are:

|Configuration| Usage |
|--|--|
| title | the article title |
| desc | the article description |

> ⚠️ **version** configuration isn't interpreted yet, but will be used for identifying the interpreter version (DynWiki MDReader)

### Tags

To use all potential of DynWiki, the tags are used to encapsulate certain instructions to identify that as a group of person. This means that persons that have *x32 systems* can have trouble downloading *x64 programs*, but instead of saying that, **configure that with tags**, to just show what is compatible with the user computer.

Ok, but that aren't actualy just compatibility tags, there are aesthetic tags, that will be transformed in a component. For example, \<cmd> tag will be turned in:

![Cmd Tag](https://github.com/vinicius-portela/dyn-wiki/blob/master/docs/images/cmd_tag.png)

This make wiki have the same apperance in all articles and, at the same time, make the article more readable

All the current supported (0.2.0) tags are:

|Tag| Usage |
|--|--|
| cmd | commands (*with copy button*) |
| img | show a image |
| scripts | list of files (*will change to fileContainer in future*)|
| file | show a file to download (*on click*)  |

Compatibility tags:

|Tag| Usage |
|--|--|
| only32 | only 32 systems |
| only64 | only 64 systems |
| onlyWindows | only Windows systems |
| onlyLinux | only Linux systems |

## Contribute with Engine <a id='contribule_engine'/>
We are working for that 👨‍💻
> If you want and understand how the engine actually works you can contribute to documentation
