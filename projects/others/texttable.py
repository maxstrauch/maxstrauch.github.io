# 2015. Maximilian Strauch.

# Very simple class to print a text based table
# with correct dimensions & co.
# "Problems:" (aka. Features)
#	- no safety checks
#	- only for colspan = 2 and = 1
class TextTable:

	def __init__(self):
		self.data = []
		self.ptr = -1
		self.caption = ''
		self.tableNo = -1

	def row(self):
		self.data.append([])
		self.ptr = len(self.data) - 1
		return

	def cell(self, data='', colspan=1):
		self.data[self.ptr].append({'data': data, 'len': len(data), 'span': colspan})
		for i in range(0, colspan-1):
			self.data[self.ptr].append({'data': '', 'len': -1, 'span': colspan})
		return

	def printMiddle(self, strt, tlen):
		buf = []
		spacel = int((tlen - len(strt))/2)
		spacer = tlen - len(strt) - spacel

		for i in range(0, spacel):
			buf.append(' ')
		buf.append(strt)
		for i in range(0, spacer):
			buf.append(' ')

		return ''.join(buf)

	def repeat(self, cc, times):
		return ''.join([cc for x in range(0, times)])

	def setCaption(self, i, theCaption):
		self.tableNo = i
		self.caption = theCaption
		return

	def splitByWS(self, stri, maxLen):
		allBuf = []
		currBuf = ''
		txts = stri.split(' ')

		for txt in txts:
			if (len(currBuf) + len(txt) + 1) > maxLen:
				allBuf.append(currBuf)
				currBuf = ''
			currBuf = (currBuf + ' ' + txt).strip()
		currBuf = currBuf.strip()
		if currBuf:
			allBuf.append(currBuf)

		return allBuf

	def render(self):
		# Calculate width for each column
		columnWidths = [0 for x in self.data[0]]
		for y in range(0, len(self.data)):
			for x in range(0, len(self.data[y])):
				if self.data[y][x]['len'] > columnWidths[x]:
					if self.data[y][x]['span'] == 1:
						columnWidths[x] = self.data[y][x]['len']
					else:
						lenHalf = int(self.data[y][x]['len']/2)
						if lenHalf > columnWidths[x]:
							columnWidths[x] = lenHalf
						if lenHalf > columnWidths[x+1]:
							columnWidths[x+1] = lenHalf

		# Upgrade the widths
		overallWidth = 0
		output = []
		for i in range(0, len(columnWidths)):
			columnWidths[i] += 2
			overallWidth += columnWidths[i]

		output.append('+')
		for x in range(0, len(self.data[y])):
			output.append(self.repeat('-', columnWidths[x]))
			output.append('+')
		output.append('\n')

		for y in range(0, len(self.data)):
			output.append('|')
			for x in range(0, len(self.data[y])):
				if self.data[y][x]['span'] == 1:
					output.append(self.printMiddle(self.data[y][x]['data'], columnWidths[x]))
				else:
					if self.data[y][x]['len'] == -1:
						continue
					else:
						output.append(self.printMiddle(self.data[y][x]['data'], 
							columnWidths[x] + columnWidths[x+1] + (self.data[y][x]['span'] - 1)))
				output.append('|')
			output.append('\n')

			output.append('+')
			for x in range(0, len(self.data[y])):
				output.append(self.repeat('-', columnWidths[x]))
				output.append('+')
			output.append('\n')

		if self.tableNo > 0:
			capt = 'Table ' + str(self.tableNo) + ': '
			output.append(capt)
			overallWidth -= len(capt)
			parts = self.splitByWS(self.caption, overallWidth)
			output.append(parts[0])
			output.append('\n')
			for i in range(1,len(parts)):
				output.append(self.repeat(' ', len(capt)))
				output.append(parts[i])
				output.append('\n')
			
		return ''.join(output)
