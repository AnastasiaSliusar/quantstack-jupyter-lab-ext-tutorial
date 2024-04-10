import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';
import { APODWidget } from './widgets/APOWidget';

/**
 * Initialization data for the jupyterlab_apod extension.
 */

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'my_first_extension',
  description: 'Show a random NASA Astronomy Picture of the Day in a JupyterLab panel.',
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ILayoutRestorer],
  activate
};

/**
* Activate the APOD widget extension.
*/
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer | null) {
  console.log('JupyterLab extension jupyterlab_apod is activated!');

  // Declare a widget variable
  let widget: MainAreaWidget<APODWidget>;

  // Add an application command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Random Astronomy Picture',
    execute: () => {
      if (!widget || widget.isDisposed) {
        const content = new APODWidget();
        widget = new MainAreaWidget({content});
        widget.id = 'apod-jupyterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      widget.content.updateAPODImage();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'apod'
  });
  if (restorer) {
    restorer.restore(tracker, {
      command,
      name: () => 'apod'
    });
  }
}

export default plugin;
