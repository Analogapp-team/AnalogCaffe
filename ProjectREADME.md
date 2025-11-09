

# File structuring

## Naming Convention 
- All components use "PascalCase"
- All folders use "kebab-case"

## Correct file structure
How the file structure for this project should be

```
src
├ assets
│ ├ icons
│ ├ images
│ └ svgs
├ components
│ ├ base-components
│ │ ├ button
│ │ │ ├ Button.jsx
│ │ │ └ Button.css
│ │ └ input-field
│ │   ├ InputField.jsx
│ │   └ Inputfield.css
│ └ modules
│   ├ post
│   │ ├ Post.jsx
│   │ └ Post.css
│   └ profile-settings
│     ├ ProfileSettings.jsx
│     └ Profile.css
├ Pages
│ ├ Home
│ ├ Explore
│ └ ...
├ App.js
└ Index.css (Contains all global variables like colors, text...)
```
# Index.css
## Global colors


## Global Text styles
In Index.css the variying text size, thickness and line height have been defined through classes. These styles are the same as the ones used in Figma.

### How to use
Applying the text styles is as simple as checking Figma for the correct text style and then applying it as a class on the h1, p or alike.

	`code`

