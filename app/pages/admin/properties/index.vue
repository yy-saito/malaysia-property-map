<template lang="pug">
AdminPageShell(title="物件管理" description="物件マスターの検索と不足情報の確認を行います。")
  template(#default)
    PropertyListFilters
    PropertyListTable.mt-6
</template>
