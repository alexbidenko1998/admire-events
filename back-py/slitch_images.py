from PIL import Image
import os, sys

from PIL import Image

lang = 'elvish_'


word = "хуй"

let_1 = Image.open(lang + word[0] + '.png')

word = word[1:]

for i in range(len(word)):
        let_img_2 = Image.open(lang + word[i] + '.png')
        (width1, height1) = let_1.size
        (width2, height2) = let_img_2.size

        result_width = width1 + width2
        result_height = max(height1, height2)

        result = Image.new('RGB', (result_width, result_height))
        result.paste(im=let_1, box=(0, 0))
        result.paste(im=let_img_2, box=(width1, 0))
        let_1 = result
let_1.save("translated_word.png")