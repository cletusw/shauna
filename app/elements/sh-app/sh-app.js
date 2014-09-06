(function () {
  'use strict';

  Polymer('sh-app', {

    created: function() {
      this.answers = [];
      this.puzzles = {};
    },

    remove: function(event, detail, sender) {
      var removed = this.answers.splice(sender.parentElement.templateInstance.model.index, 1);
      delete this.puzzles[removed[0]];
      this.$.puzzlesStore.save();
    },

    reposition: function(event) {
      var source = event.target.parentElement.templateInstance.model.index;
      var destination = event.target.value - 1;
      console.log(source, destination);

      var removed = this.answers.splice(source, 1);
      this.answers.splice(destination, 0, removed[0]);
      this.$.answersStore.save();
    },

    savePuzzle: function(event) {
      // Tab
      if (event.which === 9 && !event.shiftKey) {
        if (this.$.form.checkValidity()) {
          this.answers.push(this.currentAnswer);
          this.puzzles[this.currentAnswer] = [
            this.currentClue1,
            this.currentClue2,
            this.currentClue3
          ];
          this.$.puzzlesStore.save();
          this.currentAnswer = this.currentClue1 = this.currentClue2 = this.currentClue3 = '';
        }
        
        this.$.hidden.focus();
      }
    },

    validateAnswer: function(event, detail, sender) {
      if (Object.keys(this.puzzles).indexOf(this.currentAnswer) === -1) {
        sender.setCustomValidity('');
      }
      else {
        sender.setCustomValidity('Duplicate answer');
      }
    },

    keys: function(object) {
      return Object.keys(object);
    }

  });

})();
