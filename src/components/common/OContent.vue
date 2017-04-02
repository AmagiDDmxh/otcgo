<template lang="pug">
  .row
    .col-md-4
      h2 SiteName

    ul.col-md-8.list-inline.text-right(style="margin-top: 20px;")
      li: a(href=""): span.glyphicon.glyphicon-envelope NewsLetter
      li: a(href=""): span.glyphicon.glyphicon-leaf RSS
      li |
      li
        form.form-inline(role="form")
          .form-group
            label.sr-only Email Address
            input.form-control(
                               type="email",
                               placeholder="Enter Email"
                              )
          button.btn.btn-default Submit
</template>

<style lang="css" scoped>

</style>