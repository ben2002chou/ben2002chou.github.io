---
# Leave the homepage title empty to use the site title
title: ''
summary: ''
date: 2026-01-22
type: landing

design:
  # Default section spacing
  spacing: '6rem'

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: me
      text: >-
        PhD candidate at Purdue University researching AI/ML for audio, music, and
        multimodal systems. I build generative and transformer-based models for
        error detection and deepfake detection.
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
      headings:
        about: ''
        education: ''
        interests: ''
    design:
      # Use the new Gradient Mesh which automatically adapts to the selected theme colors
      background:
        gradient_mesh:
          enable: true

      # Name heading sizing to accommodate long or short names
      name:
        size: md # Options: xs, sm, md, lg (default), xl

      # Avatar customization
      avatar:
        size: medium # Options: small (150px), medium (200px, default), large (320px), xl (400px), xxl (500px)
        shape: circle # Options: circle (default), square, rounded
  - block: markdown
    content:
      title: Research Focus
      text: |-
        My work centers on audio and music intelligence, multimodal modeling, and
        reliable detection of synthetic and manipulated media. I combine Audio DSP,
        deep learning, and high-performance computing to build systems that scale
        from real-world datasets to production settings.
    design:
      columns: '1'
  - block: collection
    id: publications
    content:
      title: Publications
      text: ''
      filters:
        folders:
          - publications
    design:
      view: citation
  - block: collection
    id: projects
    content:
      title: Selected Projects
      text: ''
      filters:
        folders:
          - projects
    design:
      view: article-grid
      columns: 3
      show_date: false
      show_read_time: false
      show_read_more: false
  - block: markdown
    id: contact
    content:
      title: Contact
      text: |-
        Email: [ben2002chou@gmail.com](mailto:ben2002chou@gmail.com)

        LinkedIn: https://www.linkedin.com/in/benjamin-chou-6aa058228

        GitHub: https://github.com/ben2002chou
    design:
      columns: '1'
---
