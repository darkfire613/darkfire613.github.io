---
layout: post
title: 'srcset is magic'
---
I know I'm late to this party. I mainly do system programming, web development stuff is really just something I maintain enough to run basic webpages for my other projects. With that said, since I just got a Retina laptop the other day, I just learned about the `srcset` html attribute and it's pretty amazing.

If you're deploying content for high-dpi displays, the beauty of this little tool cannot be overstated. Look at this little line of code:
```html
<img src="sample.png" srcset = "sample.png 2x" />
```

That...that's it. `srcset` lets you set alternate images that the browser will choose between based on its current viewport size. In this above example, if the browser is being used on a computer with a 2x resolution screen (for example, Apple's Retina displays) it will automatically select the @2x image for display.
