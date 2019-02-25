-----------------------------------------------------------------------
$> ./README.md         | [scoped daemons] [a] [b] ...
-----------------------------------------------------------------------
   ..   |   dfdfd   |   ASDASFASF   |   gggg   |
-----------------------------------------------------------------------
# Browsed
Browser Editor

## @TODOs
- checkout browser concept (later: ~B.E.N.J.A)
- check electorn based browsers (e.g. beaker, brave, etc...)
- refine concept
- make component dependency tree + start with the elementary components
- ...
- @TODO: check windows shortcuts for moving/shifting/layouting windows

## Concept

### Browser
(menu order similar to: `IE` & `Safari` & `Brave`)
1. address bar
2. bookmarkbar
3. tabs bar
4. window (tabs in panes)

Settings, etc...
- are bookmark files in folders
- opened with a certain view app (take inspiration from BEAKER)

### Work Spaces
- WORK SPACES (= collection of PANES + TABS) savable where (USER LOGIN MENU is)
  - currently active tabbable named workspace list
    - list also recent/other workspaces under "MORE"
    - also show where "WORK SPACE" is bookmarked
  - ALT-TAB to different WORK SPACE
  - each project/folder/subfolder can contain custom WORK SPACE files
    - describe different perspective on "mindmap"
- Have many `TABS` of `WINDOWS` in `PANE`
- Split horizontal/vertical into more `PANE`s with `TABS`
- Each `TAB` can contain a `webview` or `texteditor` or other app (e.g. `terminal`)
- set of TABS in PANES can be saved as `VIEW` (e.g. think C#title bookmark folder)
- `VIEW`s

### TAB
- should have `name` in it
- can be put into fullscreen/normal/minimize or resize
- should have a `close` button
- highlights active in bookmarfolder (see details on expand) or explorer
- doubleclick active tab: show/collapse address & bookmarkbar
    - address bar
    - back/next/refresh buttons
    - extension tools
    - bookmarkbar with `..` and `current bookmark folder` of tab or `/` if not bookmarked

### bookmarkbar
0. show/hide button can minimize bar into small button in TABS bar
1. root based bookmark file tree bar
2. show as horizontal bar or FLIP to vertical leftside file explorer
3. Me as a user has a need for:
  - BAR: hover down to certain folder
  - EXPLORER: click down to certain folder
  - THEN: clickPin folder
    1. leftclick: to same PANE
      + option BACK to go to restore former opened/pinned boomark folder level
    2. rightclick: open all links in (same/new pane/window/existing other PANE)
    3. rightclick: open bookmark manager (title: active folder name)
      - have searchbar (just filenames) + advanced: include content
      - no explorer here, just folder content view (mac style subfolder expand)
        => side by side panes can help re-organzing files/folders
      - righclick file/folder:
        - open in same/new/existingPANE (Named or Numbered)
          - maybe: preview of local (or old cached network) view of content
