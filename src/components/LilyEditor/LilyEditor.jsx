import React, { Component } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { DashboardModal } from '@uppy/react';
import { dom } from '@fortawesome/fontawesome-svg-core';
// TODO: Can be removed once Froala releases jQuery-less version.
import $ from 'jquery';

import { MAX_FILE_SIZE } from 'lib/constants';

// Needed for FontAwesome to transform <i> elements (rendered by Froala) to SVG.
dom.watch();

const Uppy = require('@uppy/core');
const XHRUpload = require('@uppy/xhr-upload');

const uppy = Uppy({
  restrictions: {
    maxFileSize: MAX_FILE_SIZE
  }
});

// uppy.use(XHRUpload, {
//   endpoint: '/messaging/email/upload/'
// })

uppy.run();

class LilyEditor extends Component {
  constructor(props) {
    super(props);

    $.FroalaEditor.DefineIcon('uppy', { NAME: 'paperclip' });
    $.FroalaEditor.RegisterCommand('uppy', {
      title: 'Add attachment',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: () => {
        this.setState({ modalOpen: true });
      }
    });

    const fullPage = props.fullPage === undefined ? true : props.fullPage;
    const iframeStyle =
      'body {font-family: Roboto, sans-serif; font-size: 14px;} body table td {border: 0 !important;}';

    // Configuration for the Froala Editor.
    this.config = {
      toolbarButtons: [
        'bold',
        'italic',
        'underline',
        'fontSize',
        'paragraphFormat',
        'color',
        'align',
        'clearFormatting',
        '|',
        'insertLink',
        'insertImage',
        'html'
      ],
      spellcheck: false,
      fullPage,
      iframeStyle,
      events: {
        'froalaEditor.commands.after': this.handleCommandAfter,
        'froalaEditor.initialized': (e, editor) => this.setState({ editor })
      },
      pluginsEnabled: [
        'align',
        'codeBeautifier',
        'codeView',
        'colors',
        'draggable',
        'embedly',
        'entities',
        'file',
        'fontSize',
        'fullscreen',
        'image',
        'imageManager',
        'inlineStyle',
        'lineBreaker',
        'link',
        'lists',
        'paragraphFormat',
        'paragraphStyle',
        'quote',
        'save',
        'url',
        'video',
        'wordPaste'
      ],
      // TODO: Should be calculated instead of being hard coded and based on another property.
      toolbarStickyOffset: 57,
      codeBeautifierOptions: {
        indent_char: ' ',
        indent_size: 4
      },
      heightMin: 150,
      heightMax: props.maxHeight,
      iconsTemplate: 'font_awesome_5',
      enter: $.FroalaEditor.ENTER_BR
      // saveURL: '/api/messaging/email/email/save_draft/',
      // saveParams: {
      //   subject: 'test'
      // }
    };

    this.state = {
      files: []
    };
  }

  static getDerivedStateFromProps = nextProps => ({ modalOpen: nextProps.modalOpen });

  setHtml = html => {
    this.state.editor.html.set(html);
  };

  getHtml = () => this.state.editor.html.get();

  insertHtml = html => this.state.editor.html.insert(html);

  isEmpty = () => this.state.editor.core.isEmpty();

  handleCommandAfter = (e, editor, cmd) => {
    const { codeViewCallback } = this.props;

    if (codeViewCallback && cmd === 'html') {
      const isActive = editor.codeView.isActive();

      if (!isActive) {
        codeViewCallback(editor.html.get());
      }
    }
  };

  removeAttachment = file => {
    // Copy the files array.
    const { files } = uppy.getState();
    // Remove the file.
    delete files[file];

    uppy.setState({ files });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  bytesToSize = bytes => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  };

  render() {
    const { files } = uppy.getState();

    return (
      <div>
        <DashboardModal
          uppy={uppy}
          closeModalOnClickOutside
          hideUploadButton
          showProgressDetails
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
        />

        <FroalaEditor tag="textarea" config={this.config} />

        {Object.keys(files).length > 0 && (
          <div className="editor-attachments">
            {Object.keys(files).map(key => {
              const file = files[key];

              return (
                <div className="editor-attachment" key={file.name}>
                  <strong>
                    <div className="editor-attachment-name">{file.name}</div>
                    <div className="editor-attachment-size display-inline-block m-l-5">
                      {`(${this.bytesToSize(file.size)})`}
                    </div>
                  </strong>
                  <button
                    className="hl-primary-btn-smll no-border pull-right"
                    onClick={() => this.removeAttachment(file.id)}
                    type="button"
                  >
                    <i className="lilicon hl-close-icon" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default LilyEditor;
